package com.sr03.chat_app.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.jboss.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.sr03.chat_app.models.Chat;
import com.sr03.chat_app.models.User;
import com.sr03.chat_app.models.Invitation;
import com.sr03.chat_app.repositories.ChatRepository;
import com.sr03.chat_app.repositories.InvitationRepository;
import com.sr03.chat_app.repositories.UserRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Logger logger = Logger.getLogger(WebSocketHandler.class.getName());
    private final List<WebSocketSession> sessions;
    private final List<MessageSocket> messageSocketsHistory;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;
    private final Map<String, Integer> authenticatedUsers = new HashMap<>(); // Session ID -> User ID

    public WebSocketHandler(InvitationRepository invitationRepository,
            UserRepository userRepository,
            ChatRepository chatRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.messageSocketsHistory = new ArrayList<>();
        this.sessions = new ArrayList<>();
    }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
            throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String payload = (String) message.getPayload();
        MessageSocket receivedMessage = mapper.readValue(payload, MessageSocket.class);

        if ("AUTH_RESPONSE".equals(receivedMessage.getType())) {
            handleAuthenticationResponse(session, receivedMessage, mapper);
            return;
        }

        if (!authenticatedUsers.containsKey(session.getId())) {
            logger.warn("Message reçu de la session non authentifiée " + session.getId() + ": "
                    + receivedMessage.getMessage());
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of("type", "ERROR", "message",
                            "Authentification requise. Veuillez d'abord envoyer AUTH_RESPONSE."))));
            return;
        }

        Integer authenticatedUserId = authenticatedUsers.get(session.getId());

        logger.info("Message reçu de l'utilisateur " + authenticatedUserId + " (" + receivedMessage.getUserId() + "): "
                + receivedMessage.getMessage());

        if ("CHAT_MESSAGE".equals(receivedMessage.getType())) {
            handleChatMessage(session, receivedMessage);
        } else {
            handleUnknownMessage(session, receivedMessage);
        }
    }

    private void handleAuthenticationResponse(WebSocketSession session, MessageSocket authMessage, ObjectMapper mapper)
            throws IOException {
        Integer userId = authMessage.getUserId();
        Integer chatId = authMessage.getChatId();

        if (userId == null || chatId == null) {
            session.sendMessage(
                    new TextMessage(mapper.writeValueAsString(
                            Map.of("type", "AUTH_FAILURE", "message",
                                    "L'ID utilisateur et l'ID du chat sont requis."))));
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Données d'authentification invalides"));
            sessions.remove(session);
            return;
        }

        User user = userRepository.findById(userId.intValue()).orElse(null);
        Chat chat = chatRepository.findById(chatId.intValue()).orElse(null);

        if (user == null || chat == null) {
            session.sendMessage(
                    new TextMessage(mapper.writeValueAsString(
                            Map.of("type", "AUTH_FAILURE", "message", "ID utilisateur ou ID de chat invalide."))));
            session.close(CloseStatus.POLICY_VIOLATION.withReason("ID utilisateur/chat invalide"));
            sessions.remove(session);
            return;
        }

        // Check invitation: Find invitations by user, then check if any match the chat.
        List<Invitation> userInvitations = invitationRepository.findByUser(user);
        boolean isInvited = userInvitations.stream().anyMatch(inv -> inv.getChat().getId() == chatId.intValue());

        if (!isInvited) {
            logger.warn("Utilisateur " + userId + " non invité au chat " + chatId + ". Accès refusé.");
            session.sendMessage(
                    new TextMessage(mapper.writeValueAsString(
                            Map.of("type", "AUTH_FAILURE", "message", "Non autorisé : Pas invité à ce chat."))));
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Non invité"));
            sessions.remove(session);
            return;
        }

        logger.info(
                "Utilisateur " + userId + " (" + authMessage.getUserId() + ") authentifié avec succès pour la session "
                        + session.getId() + " dans le chat " + chatId);
        authenticatedUsers.put(session.getId(), userId);

        session.sendMessage(
                new TextMessage(mapper.writeValueAsString(
                        Map.of("type", "AUTH_SUCCESS", "message",
                                "Bienvenue à l'utilisateur " + authMessage.getUserId() + "!"))));

        // Send message history to the newly authenticated user
        for (MessageSocket historicalMessage : messageSocketsHistory) {
            session.sendMessage(new TextMessage(mapper.writeValueAsString(historicalMessage)));
        }

        // Broadcast join message
        broadcast(mapper.writeValueAsString(Map.of("type", "USER_JOIN", "userId", authMessage.getUserId(), "message",
                "L'utilisateur " + authMessage.getUserId() + " a rejoint le chat.")));
    }

    private void handleChatMessage(WebSocketSession session, MessageSocket chatMessage)
            throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        if (chatMessage.getChatId() == null) {
            logger.warn("Message reçu de l'utilisateur " + chatMessage.getUserId() + " (session: " + session.getId()
                    + ") sans chatId. Accès refusé.");
            session.sendMessage(new TextMessage(mapper.writeValueAsString(
                    Map.of("type", "ERROR", "message", "Chat ID requis."))));
            return;
        }

        messageSocketsHistory.add(chatMessage); // Store the original MessageSocket
        broadcast(mapper.writeValueAsString(chatMessage)); // Broadcast the original MessageSocket
    }

    private void handleUnknownMessage(WebSocketSession session, MessageSocket unknownMessage) throws IOException {
        logger.warn("Type de message inconnu reçu de l'utilisateur " + authenticatedUsers.get(session.getId()) + ": "
                + unknownMessage.getType());
        session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(
                Map.of("type", "ERROR", "message", "Type de message inconnu: " + unknownMessage.getType()))));
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws IOException {
        sessions.add(session);
        logger.info("Nouvelle connexion : " + session.getId() + ". Demande d'authentification.");

        // Send authentication request to client
        session.sendMessage(
                new TextMessage(
                        "{\"type\": \"AUTH_REQUEST\", \"message\": \"Veuillez envoyer votre userId et chatId.\"}"));
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        // When the client quits, we remove its session
        sessions.remove(session);
        Integer userId = authenticatedUsers.remove(session.getId());
        if (userId != null) {
            logger.info("Utilisateur " + userId + " (session: " + session.getId() + ") déconnecté.");
            try {
                this.broadcast(new ObjectMapper().writeValueAsString(Map.of("type", "USER_LEAVE", "userId", userId,
                        "message", "L\'utilisateur " + userId + " est parti.")));
            } catch (IOException e) {
                logger.error("Erreur lors de la diffusion du message de départ pour l'utilisateur " + userId, e);
            }
        } else {
            logger.info("Session " + session.getId() + " (non authentifiée) déconnectée avec le statut "
                    + status.getCode());
        }
    }

    public void broadcast(String message) throws IOException {
        for (WebSocketSession session : sessions) {
            session.sendMessage(new TextMessage(message));
        }
    }
}
