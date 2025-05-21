package com.c8a.ball.dont.lie.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/token",
            "/swagger-ui.html",
            "/v3/api-docs",
            "/swagger-resources",
            "/webjars"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        if (isPathExcluded(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token == null) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Missing token\"}");
            return;
        }

        if (!jwtTokenUtil.validateToken(token)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Invalid or expired token\"}");
            return;
        }

        boolean hasRequiredPermission = checkPermission(request, token, jwtTokenUtil);

        if (!hasRequiredPermission) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.getWriter().write("{\"error\": \"Insufficient permissions\"}");
            return;
        }

        request.setAttribute("jwt_permissions", jwtTokenUtil.extractPermissions(token));
        request.setAttribute("jwt_role", jwtTokenUtil.extractRole(token));

        filterChain.doFilter(request, response);
    }

    private boolean isPathExcluded(String path) {
        return EXCLUDED_PATHS.stream().anyMatch(path::startsWith);
    }

    private boolean checkPermission(HttpServletRequest request, String token, JwtTokenUtil jwtTokenUtil) {
        String method = request.getMethod();
        List<String> permissions = jwtTokenUtil.extractPermissions(token);
        String role = jwtTokenUtil.extractRole(token);

        System.out.println("Checking permissions for role: " + role + ", permissions: " + permissions + ", method: " + method);

        if (role.equals("ADMIN")) {
            return true;
        }

        switch (method) {
            case "GET":
                return permissions.contains("READ");
            case "POST":
                return permissions.contains("CREATE");
            case "PUT":
            case "PATCH":
                return permissions.contains("UPDATE");
            case "DELETE":
                return permissions.contains("DELETE");
            default:
                return false;
        }
    }
}
