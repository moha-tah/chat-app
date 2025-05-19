package com.sr03.chat_app.websockets;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.jboss.logging.Logger;
import org.springframework.lang.NonNull;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class WebSocketHandler extends TextWebSocketHandler {

    private final String nameChat;
    private final Logger logger = Logger.getLogger(WebSocketHandler.class.getName());
    private final List<WebSocketSession> sessions;
    private final List<MessageSocket> messageSocketsHistory;

    public WebSocketHandler(String nameChat) {
        this.nameChat = nameChat;
        this.messageSocketsHistory = new ArrayList<>();
        this.sessions = new ArrayList<>();
    }

    @Override
    public void handleMessage(@NonNull WebSocketSession session, @NonNull WebSocketMessage<?> message)
            throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        String receivedMessage = (String) message.getPayload();
        MessageSocket messageSocket = mapper.readValue(receivedMessage, MessageSocket.class);

        // We store the message in the history
        messageSocketsHistory.add(messageSocket);

        // Send the message to all connected clients
        this.broadcast(messageSocket.getUser() + " : " + messageSocket.getMessage());

    }

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws IOException {
        // We store the client's session in a list
        sessions.add(session);
        logger.info(session.getId());

        // We send the history of the channel to the client
        for (MessageSocket messageSocket : messageSocketsHistory) {
            session.sendMessage(new TextMessage(messageSocket.getUser() + " : " + messageSocket.getMessage()));
        }

        logger.info("Connecté sur le " + this.nameChat);

    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) {
        // When the client quits, we remove its session
        sessions.remove(session);
        logger.info("Déconnecté du " + this.nameChat);

    }

    public void broadcast(String message) throws IOException {
        for (WebSocketSession session : sessions) {
            session.sendMessage(new TextMessage(message));
        }
    }
}
