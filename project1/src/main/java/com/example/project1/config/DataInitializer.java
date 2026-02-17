package com.example.project1.config;

import com.example.project1.entity.User;

import com.example.project1.entity.UserType;
import com.example.project1.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!postgres")
public  class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        User admin = new User();
        admin.setNameUser("ahmed");
        admin.setPhone("0653444343");
        admin.setMail("ahmed@gmail.Com");
        admin.setPassword("ahmed123");
        admin.setUserType(UserType.ADMIN);
        userRepository.save(admin);
        System.out.println("User admin is created successefully");
        System.out.println("User admin name : "+admin.getNameUser());
        System.out.println("User admin mail : "+admin.getMail());


        User manager = new User();
        manager.setNameUser("manager");
        manager.setPhone("0634444444");
        manager.setMail("manager@gmail.com");
        manager.setPassword("manager123");
        manager.setUserType(UserType.MANAGER);
        userRepository.save(manager);
        System.out.println("User manager is created successefully");
        System.out.println("User manager details : "+manager.getNameUser());
        System.out.println("User manager mail : "+manager.getMail());


    }
}
