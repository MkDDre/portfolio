package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.dtos.AuthResponse;
import be.vinci.ipl.cae.demo.models.entities.User;
import be.vinci.ipl.cae.demo.models.entities.UserRole;
import be.vinci.ipl.cae.demo.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public UserService(UserRepository userRepository,
                     BCryptPasswordEncoder passwordEncoder,
                     JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  public AuthResponse register(String email, String password, UserRole role) {
    if (userRepository.findByEmail(email) != null) {
      throw new RuntimeException("User already exists");
    }

    User user = new User();
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(role);

    userRepository.save(user);

    String token = jwtService.generateToken(user);
    AuthResponse authResponse = new AuthResponse();
    authResponse.setToken(token);
    authResponse.setEmail(email);
    authResponse.setToken(token);
    return authResponse;
  }

  public AuthResponse login(String email, String password) {
    User user = userRepository.findByEmail(email);

    if (user == null) {
      throw new RuntimeException("User not found");
    }

    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    String token = jwtService.generateToken(user);
    AuthResponse authResponse = new AuthResponse();
    authResponse.setToken(token);
    authResponse.setEmail(email);
    authResponse.setRole(user.getRole().name());

    return new AuthResponse();
  }

  public User findByEmail(String email) {
    return userRepository.findByEmail(email);
  }
}