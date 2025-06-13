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
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Logger logger = Logger.getLogger(WebSocketHandler.class.getName());

    // Map to store sessions per chat ID
    private final Map<Integer, List<WebSocketSession>> chatSessions = new ConcurrentHashMap<>();

    // Map to store message history per chat ID
    private final Map<Integer, List<MessageSocket>> messageHistoryPerChat = new ConcurrentHashMap<>();

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatRepository chatRepository;

    // Map to store authenticated users (Session ID -> User ID)
    private final Map<String, Integer> authenticatedUsers = new ConcurrentHashMap<>();

    // Map to store chat IDs associated with each session
    private final Map<String, Integer> sessionChatIds = new ConcurrentHashMap<>();

    public WebSocketHandler(InvitationRepository invitationRepository,
            UserRepository userRepository,
            ChatRepository chatRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
    }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
            throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String payload = (String) message.getPayload();
        MessageSocket receivedMessage = mapper.readValue(payload, MessageSocket.class);

        // Extract chatId from session attribute
        Integer chatId = sessionChatIds.get(session.getId());
        if (chatId == null) {
            logger.error("Session " + session.getId() + " has no associated chatId");
            session.close(CloseStatus.PROTOCOL_ERROR.withReason("No chat ID associated with this session"));
            return;
        }

        if ("AUTH_RESPONSE".equals(receivedMessage.getType())) {
            handleAuthenticationResponse(session, receivedMessage, mapper, chatId);
            return;
        }

        if (!authenticatedUsers.containsKey(session.getId())) {
            logger.warn("Message received from unauthenticated session " + session.getId() + ": "
                    + receivedMessage.getMessage());
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(new SimplifiedMessageSocket(
                            "Authentication required. Please send AUTH_RESPONSE first.",
                            "ERROR",
                            null))));
            return;
        }

        receivedMessage.setUserId(authenticatedUsers.get(session.getId()));
        receivedMessage.setChatId(chatId); // Ensure chat ID is set correctly for internal use

        logger.info("Message received from user " + receivedMessage.getUserId() + " in chat " + chatId + ": "
                + receivedMessage.getMessage());

        if ("CHAT_MESSAGE".equals(receivedMessage.getType())) {
            handleChatMessage(session, receivedMessage);
        } else {
            handleUnknownMessage(session, receivedMessage);
        }
    }

    private void handleAuthenticationResponse(WebSocketSession session, MessageSocket authMessage,
            ObjectMapper mapper, Integer chatId) throws IOException {
        Integer userId = authMessage.getUserId();

        if (userId == null) {
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(new SimplifiedMessageSocket(
                            "User ID is required.",
                            "AUTH_FAILURE",
                            null))));
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Invalid authentication data"));
            removeChatSession(chatId, session);
            return;
        }

        User user = userRepository.findById(userId).orElse(null);
        Chat chat = chatRepository.findById(chatId).orElse(null);

        if (user == null || chat == null) {
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(new SimplifiedMessageSocket(
                            "Invalid user ID or chat ID.",
                            "AUTH_FAILURE",
                            null))));
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Invalid user ID/chat ID"));
            removeChatSession(chatId, session);
            return;
        }

        // Check invitation
        List<Invitation> userInvitations = invitationRepository.findByUser(user);
        boolean isInvited = userInvitations.stream().anyMatch(inv -> inv.getChat().getId() == chatId.intValue());

        if (!isInvited) {
            logger.warn("User " + userId + " not invited to chat " + chatId + ". Access denied.");
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(new SimplifiedMessageSocket(
                            "Not authorized: Not invited to this chat.",
                            "AUTH_FAILURE",
                            null))));
            session.close(CloseStatus.POLICY_VIOLATION.withReason("Not invited"));
            removeChatSession(chatId, session);
            return;
        }

        logger.info("User " + userId + " successfully authenticated for session "
                + session.getId() + " in chat " + chatId);
        authenticatedUsers.put(session.getId(), userId);

        session.sendMessage(new TextMessage(
                mapper.writeValueAsString(new SimplifiedMessageSocket(
                        "Welcome user " + userId + " to chat " + chatId + "!",
                        "AUTH_SUCCESS",
                        userId))));

        // Send message history (using SimplifiedMessageSocket)
        List<MessageSocket> chatHistory = messageHistoryPerChat.getOrDefault(chatId, new ArrayList<>());
        for (MessageSocket historicalMessage : chatHistory) {
            SimplifiedMessageSocket simplified = SimplifiedMessageSocket.fromMessageSocket(historicalMessage);
            session.sendMessage(new TextMessage(mapper.writeValueAsString(simplified)));
        }

        // Broadcast join message
        broadcastToChat(chatId, mapper.writeValueAsString(new SimplifiedMessageSocket(
                "L'utilisateur " + userId + " a rejoint le chat.",
                "USER_JOIN",
                userId)));
    }

    private void handleChatMessage(WebSocketSession session, MessageSocket chatMessage) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Integer chatId = sessionChatIds.get(session.getId());

        // Store the original message with chatId in history
        messageHistoryPerChat.computeIfAbsent(chatId, k -> new ArrayList<>()).add(chatMessage);

        // Broadcast simplified version
        SimplifiedMessageSocket simplified = SimplifiedMessageSocket.fromMessageSocket(chatMessage);
        broadcastToChat(chatId, mapper.writeValueAsString(simplified));
    }

    private void handleUnknownMessage(WebSocketSession session, MessageSocket unknownMessage) throws IOException {
        logger.warn("Unknown message type received from user " + authenticatedUsers.get(session.getId()) + ": "
                + unknownMessage.getType());
        session.sendMessage(new TextMessage(
                new ObjectMapper().writeValueAsString(new SimplifiedMessageSocket(
                        "Unknown message type: " + unknownMessage.getType(),
                        "ERROR",
                        null))));
    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws IOException {
        Integer chatId = extractChatIdFromSession(session);
        if (chatId == null) {
            logger.error("Could not extract chat ID from URI: " + session.getUri());
            session.close(CloseStatus.PROTOCOL_ERROR.withReason("Invalid chat ID in URL"));
            return;
        }

        sessionChatIds.put(session.getId(), chatId);
        chatSessions.computeIfAbsent(chatId, k -> new ArrayList<>()).add(session);

        logger.info("New connection: " + session.getId() + " for chat " + chatId + ". Requesting authentication.");

        session.sendMessage(new TextMessage(
                "{\"type\": \"AUTH_REQUEST\", \"message\": \"Please send your userId to authenticate.\"}"));
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        Integer chatId = sessionChatIds.remove(session.getId());
        Integer userId = authenticatedUsers.remove(session.getId());

        if (chatId != null) {
            removeChatSession(chatId, session);

            if (userId != null) {
                logger.info(
                        "L'utilisateur " + userId + " (session: " + session.getId() + ") a quitté le chat " + chatId);
                try {
                    broadcastToChat(chatId, new ObjectMapper().writeValueAsString(new SimplifiedMessageSocket(
                            "L'utilisateur " + userId + " a quitté le chat.",
                            "USER_LEAVE",
                            userId)));
                } catch (IOException e) {
                    logger.error("Error broadcasting departure message for user " + userId + " in chat " + chatId, e);
                }
            } else {
                logger.info("Session " + session.getId() + " (unauthenticated) disconnected from chat " + chatId +
                        " with status " + status.getCode());
            }
        }
    }

    public void broadcastToChat(Integer chatId, String message) throws IOException {
        List<WebSocketSession> sessions = chatSessions.getOrDefault(chatId, new ArrayList<>());
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    private void removeChatSession(Integer chatId, WebSocketSession session) {
        List<WebSocketSession> sessions = chatSessions.get(chatId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                chatSessions.remove(chatId);
            }
        }
    }

    private Integer extractChatIdFromSession(WebSocketSession session) {
        try {
            URI uri = session.getUri();
            if (uri == null)
                return null;

            String path = uri.getPath();
            String[] segments = path.split("/");
            if (segments.length > 0) {
                String lastSegment = segments[segments.length - 1];
                return Integer.parseInt(lastSegment);
            }
            return null;
        } catch (NumberFormatException e) {
            logger.error("Invalid chat ID format in WebSocket URI", e);
            return null;
        } catch (Exception e) {
            logger.error("Error extracting chat ID from WebSocket URI", e);
            return null;
        }
    }
}