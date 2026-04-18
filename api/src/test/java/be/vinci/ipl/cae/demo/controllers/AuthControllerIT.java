package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.dtos.AuthResponse;
import be.vinci.ipl.cae.demo.services.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private AuthService authService;

  @Test
  void registerShouldReturnToken() throws Exception {
    AuthResponse response = new AuthResponse();
    response.setEmail("new-user@test.com");
    response.setToken("jwt-token");
    response.setRole("CUSTOMER");

    when(authService.register(eq("new-user@test.com"), eq("strong-pwd"), any())).thenReturn(response);

    mockMvc.perform(post("/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"new-user@test.com\",\"password\":\"strong-pwd\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("new-user@test.com"))
        .andExpect(jsonPath("$.token").value("jwt-token"))
        .andExpect(jsonPath("$.role").value("CUSTOMER"));
  }

  @Test
  void loginShouldReturnValidationErrorWhenEmailMissing() throws Exception {
    mockMvc.perform(post("/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"password\":\"abc\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Validation failed"))
        .andExpect(jsonPath("$.fieldErrors.email").exists());
  }

  @Test
  void loginShouldReturnUnauthorizedWhenCredentialsInvalid() throws Exception {
    org.springframework.web.server.ResponseStatusException unauthorized =
        new org.springframework.web.server.ResponseStatusException(
            org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid credentials");

    when(authService.login("user@test.com", "wrong")).thenThrow(unauthorized);

    mockMvc.perform(post("/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"user@test.com\",\"password\":\"wrong\"}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Invalid credentials"));
  }
}

