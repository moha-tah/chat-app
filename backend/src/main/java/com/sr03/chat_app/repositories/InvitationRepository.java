package com.sr03.chat_app.repositories;

import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.Invitation;
import com.sr03.chat_app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    List<Invitation> findByUser(User user);

    List<Invitation> findByChat(Chat chat);

    void deleteByChatIdAndUserId(Integer chatId, Integer userId);
}
