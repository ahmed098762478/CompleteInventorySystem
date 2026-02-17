package com.example.project1.repository;

import com.example.project1.entity.User;
import com.example.project1.entity.UserType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByMailAndPassword_shouldFindUser() {
        User u = new User();
        u.setNameUser("John");
        u.setMail("a@b.com");
        u.setPassword("1234");
        u.setPhone("0600000000");
        u.setUserType(UserType.ADMIN); // adapte
        userRepository.save(u);

        Optional<User> found = userRepository.findByMailAndPassword("a@b.com", "1234");

        assertTrue(found.isPresent());
        assertEquals("John", found.get().getNameUser());
    }

    @Test
    void findByMailAndPassword_shouldReturnEmpty_whenWrongPassword() {
        User u = new User();
        u.setNameUser("John");
        u.setMail("a@b.com");
        u.setPassword("1234");
        u.setPhone("0600000000");
        u.setUserType(UserType.ADMIN);
        userRepository.save(u);

        Optional<User> found = userRepository.findByMailAndPassword("a@b.com", "wrong");

        assertTrue(found.isEmpty());
    }
}
