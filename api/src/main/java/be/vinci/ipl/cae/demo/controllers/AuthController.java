package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.AuthRequest;
import be.vinci.ipl.cae.demo.models.dtos.AuthResponse;
import be.vinci.ipl.cae.demo.models.entities.UserRole;
import be.vinci.ipl.cae.demo.services.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public AuthResponse register(@RequestBody AuthRequest request) {
    return authService.register(request.email, request.password, UserRole.CUSTOMER);
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody AuthRequest request) {
    return authService.login(request.email, request.password);
  }
}