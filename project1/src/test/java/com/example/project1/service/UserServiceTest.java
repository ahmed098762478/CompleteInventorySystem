package com.example.project1.service;

import com.example.project1.entity.User;
import com.example.project1.entity.UserType;
import com.example.project1.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    private User buildUser(int id, String mail) {
        User u = new User();
        u.setId(id);
        u.setNameUser("John");
        u.setMail(mail);
        u.setPassword("1234");
        u.setPhone("0600000000");
        u.setUserType(UserType.ADMIN); // adapte à ton enum
        return u;
    }

    @Test
    void createUser_shouldSaveAndReturnUser() {
        User input = buildUser(0, "a@b.com");
        User saved = buildUser(1, "a@b.com");

        when(userRepository.save(input)).thenReturn(saved);

        Optional<User> result = userService.createUser(input);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        verify(userRepository, times(1)).save(input);
    }

    @Test
    void findUserById_shouldReturnUserIfExists() {
        User u = buildUser(1, "a@b.com");
        when(userRepository.findById(1)).thenReturn(Optional.of(u));

        Optional<User> result = userService.findUserById(1);

        assertTrue(result.isPresent());
        assertEquals("a@b.com", result.get().getMail());
        verify(userRepository).findById(1);
    }

    @Test
    void findAllUsers_shouldReturnList() {
        when(userRepository.findAll()).thenReturn(List.of(buildUser(1, "a@b.com")));

        List<User> result = userService.findAllUsers();

        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void deleteUserById_shouldCallRepository() {
        doNothing().when(userRepository).deleteById(1);

        userService.deleteUserById(1);

        verify(userRepository).deleteById(1);
    }

    @Test
    void updateUser_shouldUpdateAndSave_whenUserExists() {
        User existing = buildUser(1, "old@b.com");
        User updated = buildUser(0, "new@b.com");
        updated.setNameUser("NewName");

        when(userRepository.findById(1)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        Optional<User> result = userService.updateUser(1, updated);

        assertTrue(result.isPresent());
        assertEquals("new@b.com", result.get().getMail());
        assertEquals("NewName", result.get().getNameUser());

        verify(userRepository).findById(1);
        verify(userRepository).save(existing);
    }

    @Test
    void updateUser_shouldReturnEmpty_whenUserNotFound() {
        User updated = buildUser(0, "new@b.com");
        when(userRepository.findById(99)).thenReturn(Optional.empty());

        Optional<User> result = userService.updateUser(99, updated);

        assertTrue(result.isEmpty());
        verify(userRepository).findById(99);
        verify(userRepository, never()).save(any());
    }
}
