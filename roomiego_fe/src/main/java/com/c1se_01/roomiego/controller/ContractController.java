package com.c1se_01.roomiego.controller;

import com.c1se_01.roomiego.dto.ContractCreateRequest;
import com.c1se_01.roomiego.dto.ContractResponse;
import com.c1se_01.roomiego.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    public ContractResponse createContract(@RequestBody ContractCreateRequest request) {
        return contractService.createContract(request);
    }

    @PostMapping("/room/{roomId}")
    public ContractResponse createContractForRoom(
            @PathVariable Long roomId,
            @RequestBody ContractCreateRequest request) {
        return contractService.createContractForRoom(roomId, request);
    }

    @GetMapping("/{contractId}")
    public ContractResponse getContract(@PathVariable Long contractId) {
        return contractService.getContractById(contractId);
    }
} 