package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.dtos.AuthResponse;
import be.vinci.ipl.cae.demo.models.entities.User;
import be.vinci.ipl.cae.demo.models.entities.UserRole;
import be.vinci.ipl.cae.demo.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository,
                     BCryptPasswordEncoder passwordEncoder,
                     JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(String email, String password, UserRole role) {
    if (userRepository.findByEmail(email) != null) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists");
    }

    User user = new User();
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(role);
    user.setFirstName("User");
    user.setLastName("Portfolio");
    user.setPhoneNumber("0000000000");

    userRepository.save(user);

    String token = jwtService.generateToken(user);
    AuthResponse authResponse = new AuthResponse();
    authResponse.setToken(token);
    authResponse.setEmail(email);
    authResponse.setRole(user.getRole().name());
    return authResponse;
  }

  public AuthResponse login(String email, String password) {
    User user = userRepository.findByEmail(email);

    if (user == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }

    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    String token = jwtService.generateToken(user);
    AuthResponse authResponse = new AuthResponse();
    authResponse.setToken(token);
    authResponse.setEmail(email);
    authResponse.setRole(user.getRole().name());

    return authResponse;
  }

  public User findByEmail(String email) {
    return userRepository.findByEmail(email);
  }
}