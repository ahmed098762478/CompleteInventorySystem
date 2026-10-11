package com.example.project1.entity;

import jakarta.persistence.*;

@Entity
@Table(name="orders")
public class Order {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name="id")
       private Long id;
}
