package com.example.project1.entity;

import jakarta.persistence.*;

@Entity
@Table(name="purshase_request")
public class PurshaseRequester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


}