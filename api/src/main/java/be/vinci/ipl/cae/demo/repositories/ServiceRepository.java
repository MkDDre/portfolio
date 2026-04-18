package be.vinci.ipl.cae.demo.repositories;


import be.vinci.ipl.cae.demo.models.entities.Service;
import be.vinci.ipl.cae.demo.models.entities.ServiceStatus;
import be.vinci.ipl.cae.demo.models.entities.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends CrudRepository<Service, Long> {

    /**
     * Find all services by their status.
     *
     * @param status the service status
     * @return list of services
     */
    List<Service> findByStatus(ServiceStatus status);

    /**
     * Find all services created by a specific user.
     *
     * @param author the author user
     * @return list of services
     */
    List<Service> findByAuthor(User author);
}
