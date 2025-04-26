package com.c1se_01.roomiego.controller;

import com.c1se_01.roomiego.dto.ApiResponse;
import com.c1se_01.roomiego.dto.RoomDTO;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;


    @PostMapping
    public ResponseEntity<ApiResponse<RoomDTO>> createRoom(@RequestBody RoomDTO roomDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Long ownerId = user.getId();
        // Không set ownerId vào roomDTO ở đây, mà truyền riêng xuống service
        RoomDTO createdRoom = roomService.createRoom(roomDTO, ownerId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(200, "Tạo phòng thành công", createdRoom));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getAllRooms() {
        List<RoomDTO> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(new ApiResponse<>(200, "Danh sách phòng", rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomDTO>> getRoomById(@PathVariable Long id) {
        RoomDTO roomDTO = roomService.getRoomById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Chi tiết phòng", roomDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomDTO>> updateRoom(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Long ownerId = user.getId();
        RoomDTO updatedRoom = roomService.updateRoom(id, roomDTO, ownerId);
        return ResponseEntity.ok(new ApiResponse<>(200, "Cập nhật phòng thành công", updatedRoom));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Xóa phòng thành công", null));
    }
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<RoomDTO>>> getRoomsByOwner() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Long ownerId = user.getId();
        List<RoomDTO> rooms = roomService.getRoomsByOwner(ownerId);

        return ResponseEntity.ok(new ApiResponse<>(200, "Danh sách phòng của owner", rooms));
    }

    @PostMapping("/{roomId}/hide")
    public String hideRoom(@PathVariable Long roomId) {
        roomService.hideRoom(roomId);
        return "Room hidden successfully";
    }

}
