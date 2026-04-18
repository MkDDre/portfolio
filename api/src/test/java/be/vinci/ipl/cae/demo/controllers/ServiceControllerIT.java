package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.configuration.SecurityConfiguration;
import be.vinci.ipl.cae.demo.models.entities.Service;
import be.vinci.ipl.cae.demo.models.entities.ServiceStatus;
import be.vinci.ipl.cae.demo.services.ServiceService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ServiceController.class)
@Import(SecurityConfiguration.class)
class ServiceControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private ServiceService serviceService;

  @MockBean
  private be.vinci.ipl.cae.demo.configuration.JwtAuthenticationFilter jwtAuthenticationFilter;

  @BeforeEach
  void setUpFilterPassThrough() throws Exception {
    doAnswer(invocation -> {
      ServletRequest request = invocation.getArgument(0);
      ServletResponse response = invocation.getArgument(1);
      FilterChain chain = invocation.getArgument(2);
      chain.doFilter(request, response);
      return null;
    }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
  }

  @Test
  void createServiceShouldFailWithoutAuthentication() throws Exception {
    mockMvc.perform(post("/service")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"serviceTitle\":\"Coaching\",\"price\":99.0,\"status\":\"PENDING\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "customer@test.com", roles = "CUSTOMER")
  void createServiceShouldFailWithWrongRole() throws Exception {
    mockMvc.perform(post("/service")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"serviceTitle\":\"Coaching\",\"price\":99.0,\"status\":\"PENDING\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(username = "provider@test.com", roles = "SERVICE_PROVIDER")
  void createServiceShouldSucceedForServiceProvider() throws Exception {
    Service created = new Service();
    created.setId(5L);
    created.setServiceTitle("Coaching");
    created.setPrice(99.0);
    created.setStatus(ServiceStatus.PENDING);

    when(serviceService.createService(any(Service.class), eq("provider@test.com"))).thenReturn(created);

    mockMvc.perform(post("/service")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"serviceTitle\":\"Coaching\",\"price\":99.0,\"status\":\"PENDING\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(5L))
        .andExpect(jsonPath("$.serviceTitle").value("Coaching"));

    verify(serviceService).createService(any(Service.class), eq("provider@test.com"));
  }

  @Test
  @WithMockUser(username = "user@test.com", roles = "CUSTOMER")
  void getValidatedServicesShouldReturnList() throws Exception {
    Service validated = new Service();
    validated.setId(3L);
    validated.setServiceTitle("Electricity");
    validated.setPrice(45.0);
    validated.setStatus(ServiceStatus.VALIDATED);

    when(serviceService.getValidatedServices()).thenReturn(List.of(validated));

    mockMvc.perform(get("/service/validated/all"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(3L))
        .andExpect(jsonPath("$[0].status").value("VALIDATED"));
  }
}

