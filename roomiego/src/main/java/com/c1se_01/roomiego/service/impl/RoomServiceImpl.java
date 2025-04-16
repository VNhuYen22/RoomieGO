package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.dto.RoomDTO;
import com.c1se_01.roomiego.enums.Role;
import com.c1se_01.roomiego.exception.ForbiddenException;
import com.c1se_01.roomiego.exception.NotFoundException;
import com.c1se_01.roomiego.mapper.RoomMapper;
import com.c1se_01.roomiego.model.Room;
import com.c1se_01.roomiego.model.RoomImage;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.repository.RoomImageRepository;
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
    private final RoomImageRepository roomImageRepository;  // Tiêm RoomImageRepository vào đây

    private final UserRepository userRepository;

    private final RoomMapper roomMapper;

    @Override
    public RoomDTO createRoom(RoomDTO roomDTO) {
        // Kiểm tra và lấy thông tin người dùng
        User user = userRepository.findById(roomDTO.getOwnerId())
                .orElseThrow(() -> new NotFoundException("User không tồn tại")); // Lỗi 404

        // Kiểm tra quyền người dùng
        if (!StringUtils.pathEquals(Role.OWNER.name(), user.getRole().name())) {
            throw new ForbiddenException("User không có quyền tạo phòng"); // Lỗi 403
        }

        // Chuyển đổi RoomDTO thành Room entity
        Room room = roomMapper.toEntity(roomDTO);

        // Lưu phòng vào cơ sở dữ liệu (phải lưu trước khi tạo RoomImage)
        Room savedRoom = roomRepository.save(room);

        // Xử lý hình ảnh (nếu có)
        if (roomDTO.getImageUrls() != null && !roomDTO.getImageUrls().isEmpty()) {
            List<RoomImage> roomImages = roomDTO.getImageUrls().stream()
                    .map(imageUrl -> new RoomImage(null, savedRoom, imageUrl)) // Tạo RoomImage từ URL và liên kết với Room đã lưu
                    .collect(Collectors.toList());

            // Lưu các hình ảnh vào cơ sở dữ liệu
            roomImageRepository.saveAll(roomImages);

            // Gán danh sách hình ảnh vào Room entity
            savedRoom.setRoomImages(roomImages);
        }

        // Trả về RoomDTO đã được lưu
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
