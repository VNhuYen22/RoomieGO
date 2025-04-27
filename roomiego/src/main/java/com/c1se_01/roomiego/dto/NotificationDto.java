package com.c1se_01.roomiego.dto;

import com.c1se_01.roomiego.enums.NotificationType;
import lombok.Data;

@Data
public class NotificationDto {
    private Long userId;
    private String message;
    private NotificationType type;
}