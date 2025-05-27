package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.dto.NotificationDto;
import com.c1se_01.roomiego.dto.SendMessageRequest;
import com.c1se_01.roomiego.enums.NotificationType;
import com.c1se_01.roomiego.exception.NotFoundException;
import com.c1se_01.roomiego.model.Conversation;
import com.c1se_01.roomiego.model.Message;
import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.repository.ConversationRepository;
import com.c1se_01.roomiego.repository.MessageRepository;
import com.c1se_01.roomiego.repository.UserRepository;
import com.c1se_01.roomiego.service.MessageService;
import com.c1se_01.roomiego.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    @Override
    public Message sendMessage(SendMessageRequest request) {
        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new NotFoundException("Conversation not found"));

        Long senderId = request.getSenderId();
        // Kiểm tra sender có thuộc cuộc trò chuyện không
        if (!conversation.getUser1().getId().equals(senderId) &&
                !conversation.getUser2().getId().equals(senderId)) {
            throw new RuntimeException("User is not part of this conversation");
        }

        User sender = userRepository.findById(senderId).orElseThrow();

        // Xác định người nhận
        User receiver = conversation.getUser1().getId().equals(senderId)
                ? conversation.getUser2()
                : conversation.getUser1();

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setConversation(conversation);
        message.setMessage(request.getContent());
        Message savedMessage = messageRepository.save(message);

        // Send notification to tenant
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setUserId(receiver.getId());
        notificationDto.setMessage(request.getContent());
        notificationDto.setType(NotificationType.RENT_REQUEST_CREATED);

        // Save the notification to the database
        notificationService.saveNotification(notificationDto);

        // Gửi tin nhắn real-time đến người nhận
        messagingTemplate.convertAndSend("/topic/chat/" + conversation.getId(), notificationDto);

        return savedMessage;
    }

    @Override
    public List<Message> getMessages(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow();
        return messageRepository.findByConversationOrderBySentAt(conversation);
    }
}
