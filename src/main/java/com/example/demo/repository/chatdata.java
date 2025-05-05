package com.example.demo.repository;

import com.example.demo.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;  // This is optional, but good practice

@Repository
public interface chatdata extends JpaRepository<Chat, String> { }

