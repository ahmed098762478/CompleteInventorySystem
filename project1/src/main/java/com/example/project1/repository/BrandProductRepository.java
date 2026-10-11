package com.example.project1.repository;


import com.example.project1.entity.BrandProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandProductRepository extends JpaRepository<BrandProduct,Long> {
}
