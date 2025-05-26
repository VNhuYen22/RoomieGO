package com.c1se_01.roomiego.service;

import com.c1se_01.roomiego.dto.SendMessageRequest;
import com.c1se_01.roomiego.model.Message;

import java.util.List;

public interface MessageService {
    Message sendMessage(SendMessageRequest request);

    List<Message> getMessages(Long conversationId);
}
