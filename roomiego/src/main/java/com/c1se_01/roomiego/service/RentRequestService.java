package com.c1se_01.roomiego.service;

import com.c1se_01.roomiego.dto.RentRequestCreateRequest;
import com.c1se_01.roomiego.dto.RentRequestResponse;
import com.c1se_01.roomiego.dto.RentRequestUpdateRequest;

public interface RentRequestService {
    RentRequestResponse createRentRequest(RentRequestCreateRequest request);

    RentRequestResponse updateRentRequestStatus(Long requestId, RentRequestUpdateRequest updateRequest);

    RentRequestResponse confirmViewing(Long requestId);

    RentRequestResponse confirmFinalize(Long requestId);
}
