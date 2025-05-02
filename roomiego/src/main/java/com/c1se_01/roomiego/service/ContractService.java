package com.c1se_01.roomiego.service;

import com.c1se_01.roomiego.dto.ContractCreateRequest;
import com.c1se_01.roomiego.dto.ContractResponse;

public interface ContractService {
    ContractResponse createContract(ContractCreateRequest request);

    ContractResponse getContractById(Long contractId);
}
