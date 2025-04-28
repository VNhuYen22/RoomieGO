package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(Long userId, String message) {
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, message);
    }
}
