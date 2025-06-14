package com.sr03.chat_app.repositories;

import com.sr03.chat_app.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByCreatorId(Integer creatorId);
}
