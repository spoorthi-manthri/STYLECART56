package com.stylecart.controller;

import com.stylecart.entity.CartItem;
import com.stylecart.service.CartService;
import com.stylecart.repository.CartRepository;
import com.stylecart.repository.CartItemRepository;
import com.stylecart.entity.Cart;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartController(
            CartService cartService,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository) {
        this.cartService = cartService;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    // POST: Add a product to the user's cart.
    @PostMapping("/{userId}/items")
    public ResponseEntity<?> addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request) {

        try {
            CartItem item = cartService.addToCart(
                    userId,
                    request.getProductId(),
                    request.getQuantity()
            );

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("message", "Product added to cart successfully");
            response.put("cartItemId", item.getId());
            response.put("userId", userId);
            response.put("productId", item.getProduct().getId());
            response.put("productName", item.getProduct().getName());
            response.put("quantity", item.getQuantity());

            BigDecimal discountedPrice =
                    item.getProduct().getDiscountedPrice();

            response.put("discountedPrice", discountedPrice);
            response.put(
                    "itemTotal",
                    discountedPrice.multiply(
                            BigDecimal.valueOf(item.getQuantity())
                    )
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new LinkedHashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET: Retrieve all items in the user's cart.
    @GetMapping("/{userId}/items")
    public ResponseEntity<?> getCartItems(@PathVariable Long userId) {

        return cartRepository.findByUserId(userId)
                .<ResponseEntity<?>>map(cart -> {

                    List<CartItem> items =
                            cartItemRepository.findByCartId(cart.getId());

                    List<Map<String, Object>> result = new ArrayList<>();
                    BigDecimal cartTotal = BigDecimal.ZERO;

                    for (CartItem item : items) {
                        BigDecimal unitPrice =
                                item.getProduct().getDiscountedPrice();

                        BigDecimal itemTotal = unitPrice.multiply(
                                BigDecimal.valueOf(item.getQuantity())
                        );

                        Map<String, Object> itemData =
                                new LinkedHashMap<>();

                        itemData.put("cartItemId", item.getId());
                        itemData.put("productId", item.getProduct().getId());
                        itemData.put("productName", item.getProduct().getName());
                        itemData.put("size", item.getProduct().getSize());
                        itemData.put("color", item.getProduct().getColor());
                        itemData.put("quantity", item.getQuantity());
                        itemData.put("unitPrice", unitPrice);
                        itemData.put("itemTotal", itemTotal);

                        result.add(itemData);
                        cartTotal = cartTotal.add(itemTotal);
                    }

                    Map<String, Object> response = new LinkedHashMap<>();
                    response.put("userId", userId);
                    response.put("items", result);
                    response.put("totalItems", items.size());
                    response.put("cartTotal", cartTotal);

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.ok(Map.of(
                        "userId", userId,
                        "items", List.of(),
                        "totalItems", 0,
                        "cartTotal", BigDecimal.ZERO
                )));
    }

    // Request body for adding an item.
    public static class AddToCartRequest {

        private Long productId;
        private Integer quantity;

        public AddToCartRequest() {
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    // DELETE: Remove an item from a user's cart.
    @DeleteMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long userId,
            @PathVariable Long cartItemId) {

        try {
            cartService.removeCartItem(userId, cartItemId);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("message", "Cart item removed successfully");
            response.put("cartItemId", cartItemId);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new LinkedHashMap<>();
            error.put("error", ex.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT: Update the quantity of a cart item.
    @PutMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest request) {

        try {
            CartItem item = cartService.updateCartItemQuantity(
                    userId,
                    cartItemId,
                    request.getQuantity()
            );

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("message", "Cart quantity updated successfully");
            response.put("cartItemId", item.getId());
            response.put("productId", item.getProduct().getId());
            response.put("productName", item.getProduct().getName());
            response.put("quantity", item.getQuantity());
            response.put(
                    "itemTotal",
                    item.getProduct().getDiscountedPrice()
                            .multiply(
                                    java.math.BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            )
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException ex) {
            Map<String, String> error = new LinkedHashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Request body for updating cart quantity.
    public static class UpdateCartItemRequest {
        private Integer quantity;

        public UpdateCartItemRequest() {
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

}
