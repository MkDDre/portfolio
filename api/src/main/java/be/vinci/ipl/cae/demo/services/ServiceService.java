package be.vinci.ipl.cae.demo.services;

import be.vinci.ipl.cae.demo.models.entities.Service;
import be.vinci.ipl.cae.demo.models.entities.ServiceStatus;
import be.vinci.ipl.cae.demo.models.entities.User;
import be.vinci.ipl.cae.demo.repositories.ServiceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
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
     * Get all pending services.
     *
     * @return list of pending services
     */
    public List<Service> getPendingServices() {
        return serviceRepository.findByStatus(ServiceStatus.PENDING);
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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return serviceRepository.findByAuthor(author);
    }

    /**
     * Validate a pending service.
     *
     * @param serviceId service id
     * @return updated service
     */
    public Service validateService(Long serviceId) {
        return updatePendingServiceStatus(serviceId, ServiceStatus.VALIDATED);
    }

    /**
     * Deny a pending service.
     *
     * @param serviceId service id
     * @return updated service
     */
    public Service denyService(Long serviceId) {
        return updatePendingServiceStatus(serviceId, ServiceStatus.DENIED);
    }

    /**
     * Mask one service created by the authenticated provider.
     *
     * @param serviceId service id
     * @param userEmail authenticated user email
     * @return updated service
     */
    public Service maskMyService(Long serviceId, String userEmail) {
        User user = authService.findByEmail(userEmail);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Service service = getServiceOrThrow(serviceId);
        if (service.getAuthor() == null || !service.getAuthor().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only mask your own services");
        }

        service.setStatus(ServiceStatus.MASKED);
        return serviceRepository.save(service);
    }

    private Service updatePendingServiceStatus(Long serviceId, ServiceStatus targetStatus) {
        Service service = getServiceOrThrow(serviceId);
        if (service.getStatus() != ServiceStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending services can be moderated");
        }

        service.setStatus(targetStatus);
        return serviceRepository.save(service);
    }

    private Service getServiceOrThrow(Long serviceId) {
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
    }
}
