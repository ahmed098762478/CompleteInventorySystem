package com.example.project1.repository;

import com.example.project1.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider,Long> {
}
