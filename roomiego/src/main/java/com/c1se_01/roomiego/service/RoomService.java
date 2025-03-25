package com.c1se_01.roomiego.service;

import com.c1se_01.roomiego.dto.RoomDTO;

import java.util.List;
import java.util.Optional;

public interface RoomService {
    RoomDTO createRoom(RoomDTO roomDTO);

    List<RoomDTO> getAllRooms();

    RoomDTO getRoomById(Long id);

    RoomDTO updateRoom(Long id, RoomDTO roomDTO);

    void deleteRoom(Long id);
}
