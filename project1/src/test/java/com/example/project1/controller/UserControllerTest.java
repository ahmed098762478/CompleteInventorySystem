package com.example.project1.controller;

import com.example.project1.entity.User;
import com.example.project1.entity.UserType;
import com.example.project1.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private UserService userService;

    private User buildUser(int id) {
        User u = new User();
        u.setId(id);
        u.setNameUser("John");
        u.setMail("a@b.com");
        u.setPassword("1234");
        u.setPhone("0600000000");
        u.setUserType(UserType.ADMIN); // adapte
        return u;
    }

    @Test
    void createUser_shouldReturnUser() throws Exception {
        User saved = buildUser(1);
        Mockito.when(userService.createUser(any(User.class))).thenReturn(Optional.of(saved));

        mockMvc.perform(post("/api/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildUser(0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.mail").value("a@b.com"));
    }

    @Test
    void getAllUsers_shouldReturnList() throws Exception {
        Mockito.when(userService.findAllUsers()).thenReturn(List.of(buildUser(1)));

        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getUserById_shouldReturnOptionalUser() throws Exception {
        Mockito.when(userService.findUserById(1)).thenReturn(Optional.of(buildUser(1)));

        mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateUser_shouldReturnUpdatedUser() throws Exception {
        User updated = buildUser(1);
        updated.setNameUser("Updated");

        Mockito.when(userService.updateUser(Mockito.eq(1), any(User.class)))
                .thenReturn(Optional.of(updated));

        mockMvc.perform(put("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameUser").value("Updated"));
    }
}
