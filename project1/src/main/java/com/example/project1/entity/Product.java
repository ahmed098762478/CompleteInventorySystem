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
     @JoinColumn(name="category_product_id")
     private CategoryProduct categoryProduct;

      @ManyToOne(fetch= FetchType.LAZY)
      @JoinColumn(name="brand_product_id")
      private BrandProduct brandProduct;

      public void setCategoryProduct(CategoryProduct categoryProduct){
          this.categoryProduct = categoryProduct;
      }

      public void setBrandProduct(BrandProduct brandProduct){
          this.brandProduct=brandProduct;
    }

    public CategoryProduct getCategoryProduct() {
        return categoryProduct;
    }

    public BrandProduct getBrandProduct() {
        return brandProduct;
    }
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
