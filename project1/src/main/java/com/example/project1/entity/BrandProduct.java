package com.example.project1.entity;

import jakarta.persistence.*;

@Entity
@Table(name="brand_product")
public class BrandProduct {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="brand_name")
    private String nameBrand;
}
