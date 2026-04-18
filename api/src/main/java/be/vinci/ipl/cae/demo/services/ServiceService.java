package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.entities.Service;
import be.vinci.ipl.cae.demo.models.entities.ServiceStatus;
import be.vinci.ipl.cae.demo.models.entities.User;
import be.vinci.ipl.cae.demo.repositories.ServiceRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final AuthService authService;

    public ServiceService(ServiceRepository serviceRepository, AuthService authService) {
        this.serviceRepository = serviceRepository;
        this.authService = authService;
    }

    /**
     * Create a new service for the authenticated user.
     *
     * @param service the service to create
     * @param userEmail the email of the authenticated user
     * @return the created service
     */
    public Service createService(Service service, String userEmail) {
        User author = authService.findByEmail(userEmail);
        if (author == null) {
            throw new RuntimeException("User not found");
        }
        service.setAuthor(author);
        return serviceRepository.save(service);
    }

    /**
     * Get a service by ID.
     *
     * @param id the service ID
     * @return the service if found
     */
    public Optional<Service> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    /**
     * Get all validated services.
     *
     * @return list of validated services
     */
    public List<Service> getValidatedServices() {
        return serviceRepository.findByStatus(ServiceStatus.VALIDATED);
    }

    /**
     * Get all services created by the authenticated user.
     *
     * @param userEmail the email of the authenticated user
     * @return list of services created by the user
     */
    public List<Service> getMyServices(String userEmail) {
        User author = authService.findByEmail(userEmail);
        if (author == null) {
            throw new RuntimeException("User not found");
        }
        return serviceRepository.findByAuthor(author);
    }
}
