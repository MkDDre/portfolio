package be.vinci.ipl.cae.demo.controllers;

import be.vinci.ipl.cae.demo.models.entities.Service;
import be.vinci.ipl.cae.demo.services.ServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    /**
     * Create a new service.
     * Only SERVICE_PROVIDER can create services.
     *
     * @param service the service to create
     * @param authentication the authenticated user
     * @return the created service
     */
    @PostMapping
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<Service> createService(@RequestBody Service service, Authentication authentication) {
        Service createdService = serviceService.createService(service, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }

    /**
     * Get a service by ID.
     *
     * @param id the service ID
     * @return the service if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Service> getService(@PathVariable Long id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get all validated services.
     *
     * @return list of validated services
     */
    @GetMapping("/validated/all")
    public ResponseEntity<List<Service>> getValidatedServices() {
        List<Service> services = serviceService.getValidatedServices();
        return ResponseEntity.ok(services);
    }

    /**
     * Get all pending services.
     * Only ADMIN can access this.
     *
     * @return list of pending services
     */
    @GetMapping("/pending/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Service>> getPendingServices() {
        List<Service> services = serviceService.getPendingServices();
        return ResponseEntity.ok(services);
    }

    /**
     * Get all services created by the authenticated user.
     * Only SERVICE_PROVIDER can access this.
     *
     * @param authentication the authenticated user
     * @return list of services created by the user
     */
    @GetMapping("/my-services")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<List<Service>> getMyServices(Authentication authentication) {
        List<Service> services = serviceService.getMyServices(authentication.getName());
        return ResponseEntity.ok(services);
    }

    /**
     * Validate one pending service.
     * Only ADMIN can access this.
     *
     * @param id service id
     * @return updated service
     */
    @PatchMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> validateService(@PathVariable Long id) {
        Service updatedService = serviceService.validateService(id);
        return ResponseEntity.ok(updatedService);
    }

    /**
     * Deny one pending service.
     * Only ADMIN can access this.
     *
     * @param id service id
     * @return updated service
     */
    @PatchMapping("/{id}/deny")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> denyService(@PathVariable Long id) {
        Service updatedService = serviceService.denyService(id);
        return ResponseEntity.ok(updatedService);
    }

    /**
     * Mask one service created by the authenticated provider.
     * Only SERVICE_PROVIDER can access this.
     *
     * @param id service id
     * @param authentication authenticated user
     * @return updated service
     */
    @PatchMapping("/{id}/mask")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<Service> maskMyService(@PathVariable Long id, Authentication authentication) {
        Service updatedService = serviceService.maskMyService(id, authentication.getName());
        return ResponseEntity.ok(updatedService);
    }
}
