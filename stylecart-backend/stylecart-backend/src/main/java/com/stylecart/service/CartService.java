
package com.stylecart.service;

import com.stylecart.entity.Cart;
import com.stylecart.entity.CartItem;
import com.stylecart.entity.Product;
import com.stylecart.entity.User;
import com.stylecart.repository.CartItemRepository;
import com.stylecart.repository.CartRepository;
import com.stylecart.repository.ProductRepository;
import com.stylecart.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Add a product to the user's cart.
    @Transactional
    public CartItem addToCart(Long userId, Long productId, int quantity) {

        if (quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Product not found"));

        if (product.getStockQuantity() == null
                || quantity > product.getStockQuantity()) {
            throw new IllegalArgumentException(
                    "Requested quantity exceeds available stock");
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        CartItem item = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        if (item != null) {
            int newQuantity = item.getQuantity() + quantity;

            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException(
                        "Total quantity exceeds available stock");
            }

            item.setQuantity(newQuantity);
        } else {
            item = new CartItem(cart, product, quantity);
        }

        return cartItemRepository.save(item);
    }

    // Remove an item from the specified user's cart.
    @Transactional
    public void removeCartItem(Long userId, Long cartItemId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cart not found for this user"));

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException(
                    "This cart item does not belong to this user");
        }

        cartItemRepository.delete(item);
    }

    // Update the quantity of an item in the user's cart.
    @Transactional
    public CartItem updateCartItemQuantity(

            Long userId, Long cartItemId, int quantity) {

        if (quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1");
        }Cart cart = cartRepository.findByUserId(userId)
        .orElseThrow(() ->
                new IllegalArgumentException(
                        "Cart not found for this user"));

        System.out.println("Updating cart item ID: " + cartItemId);
        System.out.println("Cart item count: " + cartItemRepository.count());

CartItem item = cartItemRepository.findById(cartItemId)
        .orElseThrow(() ->
                new IllegalArgumentException(
                        "Cart item not found"));
// Verify the item belongs to this user's cart.
        if (!item.getCart().getId().equals(cart.getId())) {
        throw new IllegalArgumentException(
                    "This cart item does not belong to this user");
        }

Product product = item.getProduct();

        if (product.getStockQuantity() == null
        || quantity > product.getStockQuantity()) {
        throw new IllegalArgumentException(
                    "Requested quantity exceeds available stock");
        }

                item.setQuantity(quantity);

        return cartItemRepository.save(item);
    }
            }
