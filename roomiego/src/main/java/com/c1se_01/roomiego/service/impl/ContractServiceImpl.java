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

import java.math.BigDecimal;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

        private final ContractRepository contractRepository;
        private final RoomRepository roomRepository;
        private final UserRepository userRepository;
        private final ContractMapper contractMapper;

        @Override
        public ContractResponse createContract(ContractCreateRequest request) {
                // Validate input data
                if (request.getStartDate() == null || request.getEndDate() == null) {
                        throw new RuntimeException("Start date and end date are required");
                }
                if (request.getStartDate().after(request.getEndDate())) {
                        throw new RuntimeException("Start date must be before end date");
                }
                if (request.getPricePerMonth() == null || request.getPricePerMonth().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new RuntimeException("Price per month must be greater than 0");
                }

                Room room = roomRepository.findById(request.getRoomId())
                                .orElseThrow(() -> new RuntimeException("Room not found"));

                User tenant = userRepository.findById(request.getTenantId())
                                .orElseThrow(() -> new RuntimeException("Tenant not found"));

                User owner = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

                // Check if room is available for the given period
                boolean isRoomAvailable = contractRepository.findByRoomAndDateRange(
                                room, request.getStartDate(), request.getEndDate()).isEmpty();
                if (!isRoomAvailable) {
                        throw new RuntimeException("Room is not available for the selected period");
                }

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

}
