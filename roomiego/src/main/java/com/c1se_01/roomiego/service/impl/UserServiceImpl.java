package com.c1se_01.roomiego.service.impl;

import com.c1se_01.roomiego.model.User;
import com.c1se_01.roomiego.repository.UserRepository;
import com.c1se_01.roomiego.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByFullName(String fullName) {
        return userRepository.findByFullName(fullName);
    }
}
