
package com.stylecart.repository;

import com.stylecart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find the cart belonging to a particular user.
    Optional<Cart> findByUserId(Long userId);
}
