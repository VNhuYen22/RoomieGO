package com.c1se_01.roomiego.controller;

import com.c1se_01.roomiego.dto.RoommateDTO;
import com.c1se_01.roomiego.dto.RoommateResponseDTO;
import com.c1se_01.roomiego.service.RoommateService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/roommates")
@RequiredArgsConstructor
public class RoomateController {

    private final RoommateService roommateService;

    @PostMapping
    public ResponseEntity<RoommateResponseDTO> createRoommate(@Valid @RequestBody RoommateDTO dto) {
        RoommateResponseDTO responseDTO = roommateService.createRoommate(dto);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    public ResponseEntity<List<RoommateResponseDTO>> getAllRoommates() {
        return ResponseEntity.ok(roommateService.getAllRoommates());
    }

    @GetMapping("/export-to-file")
    public ResponseEntity<String> exportRoommatesToFile() throws IOException {
        List<RoommateResponseDTO> roommates = roommateService.getAllRoommates();

        // Chuyển list sang chuỗi JSON
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonContent = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(roommates);

        // Đường dẫn file muốn lưu
        String filePath = "D:/RoomieGO//roommate_finder/data.json"; // dùng dấu "/" cho tương thích đa nền tảng

        // Ghi nội dung vào file
        File file = new File(filePath);
        file.getParentFile().mkdirs(); // tạo folder nếu chưa có
        Files.write(file.toPath(), jsonContent.getBytes(StandardCharsets.UTF_8));

        return ResponseEntity.ok("Exported roommates to file: " + filePath);
    }
}
