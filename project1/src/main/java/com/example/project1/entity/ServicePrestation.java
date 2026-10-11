package com.example.project1.entity;

import jakarta.persistence.*;

@Entity
@Table(name="service_prestation")
public class ServicePrestation {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="name_prestation")
    private String namePrestationService;

}
