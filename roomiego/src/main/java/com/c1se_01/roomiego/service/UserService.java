package com.c1se_01.roomiego.service;

import com.c1se_01.roomiego.model.User;

public interface UserService {
    User findByFullName(String fullName);
}
