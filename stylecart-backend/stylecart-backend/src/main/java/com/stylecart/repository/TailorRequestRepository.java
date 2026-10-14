
package com.stylecart.repository;

import com.stylecart.entity.TailorRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TailorRequestRepository
        extends JpaRepository<TailorRequest, Long> {
}
