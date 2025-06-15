# SR03 - ChatApp

## Description du projet

Ce projet consiste en une application de salon de discussion (chat) divisée en deux parties :

- **Partie 1 : Application Web**  
  Une interface web pour gérer les utilisateurs, planifier, éditer et afficher les salons de discussion.  
  Technologies utilisées :  
  - Backend : Spring Boot (Java) avec JPA/Hibernate pour la gestion des données  
  - Frontend utilisateur : React (single-page app) avec appels API REST vers le backend  
  - **Interface administrateur : pages HTML / Thymeleaf intégrées directement dans l’application Spring Boot** (pas en React)

- **Partie 2 : Serveur de chat**  
  Un serveur WebSocket Java pour diffuser les messages en temps réel aux clients connectés à un canal.

---

## Architecture générale

```
[Frontend React (utilisateur)]
        ⇅ API REST
[Backend Spring Boot + WebSocket Server + Interface admin HTML]
        ⇅
     [Base de données PostgreSQL]
```

- Le frontend React communique avec le backend via des API REST.
- L’interface administrateur est servie par Spring Boot via des pages HTML/Thymeleaf.
- Le serveur WebSocket est intégré au backend Spring Boot.
- Les messages ne sont pas persistés : ils sont uniquement diffusés aux utilisateurs connectés.

---

## Technologies utilisées

- Java 17+
- Spring Boot 3.x
- JPA / Hibernate
- Thymeleaf / HTML / CSS / JS (interface admin)
- React 18+ (interface utilisateur)
- WebSocket API Java
- PostgreSQL
- pnpm (gestionnaire de paquets pour le frontend)


## Instructions pour lancer l’application

### Prérequis

- Java JDK 17 ou plus  
- Maven  
- Node.js + pnpm (`npm install -g pnpm`)  
- PostgreSQL (ou un autre SGBD compatible)  

### Lancement du backend (Spring Boot)

```bash
git clone 
cd backend
mvnw spring-boot:run
```

### Lancement du frontend (React - utilisateur)

```bash
cd frontend
pnpm install
pnpm dev
```

## Fonctionnement du serveur WebSocket

- Le serveur WebSocket est intégré dans le backend.
- Il est activé automatiquement au lancement de Spring Boot.
- Les messages sont diffusés uniquement en direct (non enregistrés).

## Auteurs

- Mohamed Tahiri  
- Ismat Abou Khachfe
