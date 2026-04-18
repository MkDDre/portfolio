package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.AuthRequest;
import be.vinci.ipl.cae.demo.models.dtos.AuthResponse;
import be.vinci.ipl.cae.demo.models.entities.UserRole;
import be.vinci.ipl.cae.demo.services.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/register")
  public AuthResponse register(@RequestBody AuthRequest request) {
    return userService.register(request.email, request.password, UserRole.CUSTOMER);
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody AuthRequest request) {
    return userService.login(request.email, request.password);
  }
}