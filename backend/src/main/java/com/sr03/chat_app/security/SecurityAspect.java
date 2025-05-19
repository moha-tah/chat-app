package com.sr03.chat_app.security;

import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class SecurityAspect {

    @Before("@annotation(com.sr03.chat_app.security.RequiresAdmin)")
    public void checkAdminAccess() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false); // false means do not create if not exists

        if (session == null || session.getAttribute("userId") == null) {
            throw new UnauthorizedAdminAccessException("Accès non autorisé. Veuillez vous connecter.");
        }

        Boolean isAdmin = (Boolean) session.getAttribute("isAdmin");
        if (isAdmin == null || !isAdmin) {
            throw new UnauthorizedAdminAccessException("Accès non autorisé. Privilèges administrateur requis.");
        }
    }
}