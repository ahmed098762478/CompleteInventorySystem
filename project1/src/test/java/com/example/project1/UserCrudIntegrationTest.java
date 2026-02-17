package com.example.project1;

import com.example.project1.entity.User;
import com.example.project1.entity.UserType;
import com.example.project1.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserCrudIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;

    @BeforeEach
    void cleanDb() {
        userRepository.deleteAll();
    }

    private User buildUser() {
        User u = new User();
        u.setNameUser("John");
        u.setMail("a@b.com");
        u.setPassword("1234");
        u.setPhone("0600000000");
        u.setUserType(UserType.ADMIN);
        return u;
    }

    @Test
    void fullCrudScenario() throws Exception {
        // CREATE
        String createResponse = mockMvc.perform(post("/api/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildUser())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn().getResponse().getContentAsString();

        User created = objectMapper.readValue(createResponse, User.class);
        int id = created.getId();

        // READ by id
        mockMvc.perform(get("/api/user/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mail").value("a@b.com"));

        // UPDATE
        created.setNameUser("Updated");
        mockMvc.perform(put("/api/user/" + id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(created)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameUser").value("Updated"));

        // READ all
        mockMvc.perform(get("/api/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id));
    }
}
