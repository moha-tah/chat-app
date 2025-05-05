package com.example.demo.repository;

import com.example.demo.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;  // This is optional, but good practice

@Repository
public interface invitationdata extends JpaRepository<Invitation, Integer> { }

