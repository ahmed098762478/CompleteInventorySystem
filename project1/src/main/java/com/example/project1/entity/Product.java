package com.example.project1.entity;

import jakarta.persistence.*;

@Entity
@Table(name="product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="name_product")
    private String name;

    @Column(name="Description")
    private String description;

    @Column(name="prix")
    private double price;

     @ManyToOne(fetch = FetchType.LAZY)
     CategoryProduct categoryProduct;

    // getters et setters


    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription(){
        return description;
    }

    public double getPrice(){
        return price;
    }

    public void setId(int id){
        this.id=id;
    }

    public void setName(String name){
        this.name=name;
    }

    public void setDescription(String description){
        this.description=description;
    }

    public void setPrice(double price){
        this.price=price;
    }


}
