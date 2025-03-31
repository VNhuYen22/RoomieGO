package com.c1se_01.roomiego.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long conversationId;
    private Long senderId;
    private String content;
}
