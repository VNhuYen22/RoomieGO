package com.c1se_01.roomiego.controller;

import com.c1se_01.roomiego.dto.RentRequestCreateRequest;
import com.c1se_01.roomiego.dto.RentRequestResponse;
import com.c1se_01.roomiego.dto.RentRequestUpdateRequest;
import com.c1se_01.roomiego.service.RentRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rent-requests")
@RequiredArgsConstructor
public class RentRequestController {
    private final RentRequestService rentRequestService;
    @PostMapping
    public RentRequestResponse createRentRequest(@RequestBody RentRequestCreateRequest request) {
        return rentRequestService.createRentRequest(request);
    }
    @PutMapping("/{requestId}")
    public RentRequestResponse updateRentRequestStatus(
            @PathVariable Long requestId,
            @RequestBody RentRequestUpdateRequest updateRequest) {
        return rentRequestService.updateRentRequestStatus(requestId, updateRequest);
    }

    @PostMapping("/{requestId}/confirm-viewing")
    public RentRequestResponse confirmViewing(@PathVariable Long requestId) {
        return rentRequestService.confirmViewing(requestId);
    }

    @PostMapping("/{requestId}/finalize")
    public RentRequestResponse confirmFinalize(@PathVariable Long requestId) {
        return rentRequestService.confirmFinalize(requestId);
    }
}
