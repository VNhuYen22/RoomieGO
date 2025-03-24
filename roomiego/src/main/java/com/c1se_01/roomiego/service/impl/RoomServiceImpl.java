package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.dto.RoomDTO;
import com.c1se_01.roomiego.enums.Role;
import com.c1se_01.roomiego.exception.ForbiddenException;
import com.c1se_01.roomiego.exception.NotFoundException;
import com.c1se_01.roomiego.mapper.RoomMapper;
import com.c1se_01.roomiego.model.Room;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.repository.RoomRepository;
import com.c1se_01.roomiego.repository.UserRepository;
import com.c1se_01.roomiego.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;

    private final UserRepository userRepository;

    private final RoomMapper roomMapper;

    @Override
    public RoomDTO createRoom(RoomDTO roomDTO) {
        User user = userRepository.findById(roomDTO.getOwnerId())
                .orElseThrow(() -> new NotFoundException("User không tồn tại")); // Lỗi 404

        if (!StringUtils.pathEquals(Role.OWNER.name(), user.getRole().name())) {
            throw new ForbiddenException("User không có quyền tạo phòng"); // Lỗi 403
        }

        Room room = roomMapper.toEntity(roomDTO);
        Room savedRoom = roomRepository.save(room);
        return roomMapper.toDTO(savedRoom);
    }

    @Override
    public List<RoomDTO> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            throw new NotFoundException("Không có phòng nào được tìm thấy");
        }
        return rooms.stream().map(roomMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public RoomDTO getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Phòng không tồn tại"));
        return roomMapper.toDTO(room);
    }

    @Override
    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Phòng không tồn tại"));

        // Kiểm tra quyền chỉnh sửa
        User user = userRepository.findById(roomDTO.getOwnerId())
                .orElseThrow(() -> new NotFoundException("User không tồn tại"));

        if (!StringUtils.pathEquals(Role.OWNER.name(), user.getRole().name())) {
            throw new ForbiddenException("User không có quyền chỉnh sửa phòng này");
        }

        roomMapper.updateEntityFromDTO(roomDTO, existingRoom);
        Room updatedRoom = roomRepository.save(existingRoom);
        return roomMapper.toDTO(updatedRoom);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Phòng không tồn tại"));

        roomRepository.delete(room);
    }

}
