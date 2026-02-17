package com.example.project1.service;

import com.example.project1.entity.User;
import com.example.project1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> createUser(User user){
        return Optional.of(userRepository.save(user));
    }

    public Optional<User> findUserById(int id){
        return userRepository.findById(id);
    }

    public List<User> findAllUsers(){
        return userRepository.findAll();
    }

    public void deleteUserById(int id){
        userRepository.deleteById(id);
    }


    public Optional<User> updateUser(int id, User updatedUser){
        return userRepository.findById(id).map(user -> {
            user.setNameUser(updatedUser.getNameUser());
            user.setMail(updatedUser.getMail());
            user.setPassword(updatedUser.getPassword());
            user.setPhone(updatedUser.getPhone());
            user.setUserType(updatedUser.getUserType());
            return userRepository.save(user);
        });
    }

}