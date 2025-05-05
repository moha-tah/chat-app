package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;  // This is optional, but good practice

// Define the repository interface (extends JpaRepository)
@Repository
public interface userdata extends JpaRepository<User, Integer> {
    // You can add custom queries or methods here if needed
}
