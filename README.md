# SR03 - ChatApp

## Project Description

This project consists of a chat application divided into two parts:

- **Part 1: Web Application**  
  A web interface to manage users, schedule, edit, and display chats.  
  Technologies used:

  - Backend: Spring Boot (Java) with JPA/Hibernate for data management
  - User frontend: React (single-page app) with REST API calls to the backend
  - **Administrator interface: HTML / Thymeleaf pages integrated directly into the Spring Boot application**

- **Part 2: Chat Server**  
  A Java WebSocket server to broadcast messages in real-time to clients connected to a channel.

---

## General Architecture

<img width="1025" height="636" alt="Database Schema" src="https://github.com/user-attachments/assets/9d69466a-4618-42b9-bc64-ddf9a3c73194" />


```
[React Frontend (user)]
        ⇅ REST API
[Backend Spring Boot + WebSocket Server + HTML admin interface]
        ⇅
     [PostgreSQL Database]
```

- The React frontend communicates with the backend via REST APIs.
- The admin interface is served by Spring Boot via HTML/Thymeleaf pages.
- The WebSocket server is integrated into the Spring Boot backend.
- Messages are not persisted: they are only broadcast to connected users.

---

## Technologies Used

- Java
- Spring Boot 3.x
- JPA / Hibernate
- Thymeleaf / HTML / CSS / JS (admin interface)
- React 18+ (user interface)
- WebSocket API Java
- PostgreSQL
- pnpm (package manager for the frontend)

## Instructions to run the application

### Prerequisites

- Java JDK 17 or higher
- Maven
- Node.js + pnpm (`npm install -g pnpm`)
- PostgreSQL (or another compatible DBMS)

### Launching the backend (Spring Boot)

```bash
git clone
cd backend
mvnw spring-boot:run
```

### Launching the frontend (React)

```bash
cd frontend
npm i -g pnpm
pnpm install
pnpm dev
```

## WebSocket Server Operation

- The WebSocket server is integrated into the backend.
- It is activated automatically when Spring Boot starts.
- Messages are broadcast only live (not saved).

## Authors

- Mohamed Tahiri
- Ismat Abou Khachfe
