
package com.stylecart.repository;

import com.stylecart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    // Retrieve every item belonging to a cart.
    List<CartItem> findByCartId(Long cartId);

    // Find a specific product inside a particular cart.
    Optional<CartItem> findByCartIdAndProductId(
            Long cartId,
            Long productId
    );

    // Remove all items belonging to a cart.
    void deleteByCartId(Long cartId);
}

