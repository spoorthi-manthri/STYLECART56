
package com.stylecart.controller;

import com.stylecart.entity.Product;
import com.stylecart.service.ProductService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")



public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // Get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable Long id) {

        try {
            return ResponseEntity.ok(
                    productService.getProductById(id)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Add a product
    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestBody Product product) {

        try {
            Product savedProduct =
                    productService.addProduct(product);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(savedProduct);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Filter products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                productService.getProductsByCategory(category)
        );
    }

    // Filter products by fabric
    @GetMapping("/fabric/{fabric}")
    public ResponseEntity<List<Product>> getByFabric(
            @PathVariable String fabric) {

        return ResponseEntity.ok(
                productService.getProductsByFabric(fabric)
        );
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<Product>> getByBrand(
            @PathVariable String brand) {
        return ResponseEntity.ok(
                productService.getProductsByBrand(brand));
    }

    @GetMapping("/size/{size}")
    public ResponseEntity<List<Product>> getBySize(
            @PathVariable String size) {
        return ResponseEntity.ok(
                productService.getProductsBySize(size));
    }

    @GetMapping("/color/{color}")
    public ResponseEntity<List<Product>> getByColor(
            @PathVariable String color) {
        return ResponseEntity.ok(
                productService.getProductsByColor(color));
    }

}
