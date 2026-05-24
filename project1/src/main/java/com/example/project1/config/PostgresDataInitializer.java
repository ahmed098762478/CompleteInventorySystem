package com.example.project1.config;

import com.example.project1.entity.User;
import com.example.project1.entity.UserType;
import com.example.project1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("postgres")
public class PostgresDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize data for PostgreSQL profile
        User admin = new User();
        admin.setNameUser("postgres_admin");
        admin.setPhone("0653444343");
        admin.setMail("admin@postgres.com");
        admin.setPassword("admin123");
        admin.setUserType(UserType.ADMIN);
        userRepository.save(admin);

        User manager = new User();
        manager.setNameUser("postgres_manager");
        manager.setPhone("0634444444");
        manager.setMail("manager@postgres.com");
        manager.setPassword("manager123");
        manager.setUserType(UserType.MANAGER);
        userRepository.save(manager);

        System.out.println("PostgreSQL data initialized.");
    }
}