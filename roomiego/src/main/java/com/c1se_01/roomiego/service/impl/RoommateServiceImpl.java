package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.dto.RoommateDTO;
import com.c1se_01.roomiego.dto.RoommateResponseDTO;
import com.c1se_01.roomiego.mapper.RoommateMapper;
import com.c1se_01.roomiego.model.Roommate;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.repository.RoommateRepository;
import com.c1se_01.roomiego.repository.UserRepository;
import com.c1se_01.roomiego.service.RoommateService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RoommateServiceImpl implements RoommateService {
    private final RoommateRepository roommateRepository;

    private final UserRepository userRepository;

    private final RoommateMapper roommateMapper;

    @Override
    public RoommateResponseDTO createRoommate(RoommateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User ID không tồn tại: " + dto.getUserId()));

        Roommate roommate = roommateMapper.toEntity(dto, user);
        roommateRepository.save(roommate);
        RoommateResponseDTO responseDTO = roommateMapper.toResponseDTO(roommate);
        return responseDTO;
    }

    @Override
    public List<RoommateResponseDTO> getAllRoommates() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        List<RoommateResponseDTO> roommateList = new ArrayList<>();
        if (Objects.nonNull(user)) {
            roommateList = roommateMapper.toResponseDTOs(roommateRepository.findAllByGender(String.valueOf(user.getGender())));
            roommateList.removeIf(roommate ->
                    user.getId().equals(roommate.getUserId())
            );
        }
        return roommateList;
    }
}
