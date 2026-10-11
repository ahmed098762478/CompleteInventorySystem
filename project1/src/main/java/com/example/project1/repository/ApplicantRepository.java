package com.example.project1.repository;

import com.example.project1.entity.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicantRepository extends JpaRepository<Applicant,Long> {
}
