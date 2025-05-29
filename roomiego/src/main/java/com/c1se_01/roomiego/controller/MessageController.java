package com.c1se_01.roomiego.controller;

import com.c1se_01.roomiego.dto.MessageDto;
import com.c1se_01.roomiego.dto.SendMessageRequest;
import com.c1se_01.roomiego.model.Message;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.service.MessageService;
import com.c1se_01.roomiego.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

//    @GetMapping("/conversation/{conversationId}")
//    public ResponseEntity<List<Message>> getMessages(@PathVariable Long conversationId) {
//        return ResponseEntity.ok(messageService.getMessages(conversationId));
//    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<User> findByUsername(@RequestParam String username) {
        User user = userService.findByFullName(username);
        if (user == null) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public MessageDto receiveMessage(MessageDto messageDto) throws InterruptedException {
        messageService.saveMessage(messageDto);

        // Simulate delay for demonstration (optional)
        Thread.sleep(1000);

        return messageDto;
    }

    @MessageMapping("/private-message")
    public void privateMessage(MessageDto messageDto) {
        String receiver = messageDto.getReceiverName();
        simpMessagingTemplate.convertAndSendToUser(receiver, "/private", messageDto);

        // Save private message to the database
        messageService.saveMessage(messageDto);
    }

    @GetMapping("/api/messages/history/{user1}/{user2}")
    public ResponseEntity<List<Message>> getChatHistory(
            @PathVariable String user1,
            @PathVariable String user2
    ) {
        List<Message> messages = messageService.findByReceiverNameOrSenderName(user1, user2);
        return ResponseEntity.ok(messages);
    }
}
