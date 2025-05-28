package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.dto.ContractCreateRequest;
import com.c1se_01.roomiego.dto.ContractResponse;
import com.c1se_01.roomiego.enums.PaymentStatus;
import com.c1se_01.roomiego.mapper.ContractMapper;
import com.c1se_01.roomiego.model.Contract;
import com.c1se_01.roomiego.model.Room;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.repository.ContractRepository;
import com.c1se_01.roomiego.repository.RoomRepository;
import com.c1se_01.roomiego.repository.UserRepository;
import com.c1se_01.roomiego.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ContractMapper contractMapper;

    @Override
    public ContractResponse createContract(ContractCreateRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        User tenant = userRepository.findById(request.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        User owner = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Kiểm tra người tạo hợp đồng phải là chủ phòng
//        if (!room.getOwner().getId().equals(owner.getId())) {
//            throw new RuntimeException("Only owner of the room can create contract");
//        }

        Contract contract = new Contract();
        contract.setRoom(room);
        contract.setTenant(tenant);
        contract.setOwner(owner);
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setPricePerMonth(request.getPricePerMonth());
        contract.setPaymentStatus(PaymentStatus.PENDING);

        Contract saved = contractRepository.save(contract);
        return contractMapper.toDto(saved);
    }

    @Override
    public ContractResponse getContractById(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        return contractMapper.toDto(contract);
    }

    @Override
    public List<ContractResponse> getAllContracts() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<Contract> contracts = contractRepository.findByOwnerOrTenant(currentUser, currentUser);
        return contracts.stream()
                .map(contractMapper::toDto)
                .collect(Collectors.toList());
    }
}
