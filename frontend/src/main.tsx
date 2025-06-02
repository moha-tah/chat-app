import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatsPage from "./pages/ChatsPage";
import { Toaster } from "./components/ui/sonner";
import PageTitle from "./components/PageTitle";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Accueil" />
              <Home />
            </>
          }
        />
        <Route
          path="/chats"
          element={
            <>
              <PageTitle title="Mes chats" />
              <ChatsPage />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Connexion" />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <PageTitle title="Inscription" />
              <SignUpPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
