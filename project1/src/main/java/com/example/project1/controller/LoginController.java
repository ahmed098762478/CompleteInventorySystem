package com.example.project1.controller;

import com.example.project1.dto.LoginDTO;
import com.example.project1.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/login")
@CrossOrigin("*")
public class LoginController {

    @Autowired
    private LoginService loginService;

}
