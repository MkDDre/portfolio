package be.vinci.ipl.cae.demo.configuration;

import be.vinci.ipl.cae.demo.services.JwtService;
import be.vinci.ipl.cae.demo.services.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final AuthService authService;

  public JwtAuthenticationFilter(JwtService jwtService, AuthService authService) {
    this.jwtService = jwtService;
    this.authService = authService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain)
          throws ServletException, IOException {

    String header = request.getHeader("Authorization");

    if (header != null && header.startsWith("Bearer ")) {
      String token = header.substring(7);

      try {
        String email = jwtService.extractUsername(token);
        String role = jwtService.extractRole(token);

        var user = authService.findByEmail(email);

        if (user != null) {
          var auth = new UsernamePasswordAuthenticationToken(
                  user,
                  null,
                  List.of(new SimpleGrantedAuthority("ROLE_" + role))
          );
          SecurityContextHolder.getContext().setAuthentication(auth);
        }

      } catch (Exception ignored) {}
    }

    filterChain.doFilter(request, response);
  }
}