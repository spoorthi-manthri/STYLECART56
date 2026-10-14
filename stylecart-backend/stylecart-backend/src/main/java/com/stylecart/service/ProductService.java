
package com.stylecart.service;

import com.stylecart.entity.Product;
import com.stylecart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get one product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Product not found with ID: " + id));
    }

    // Add a new product
    public Product addProduct(Product product) {
        validateProduct(product);
        return productRepository.save(product);
    }

    // Filter products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    // Filter products by fabric
    public List<Product> getProductsByFabric(String fabric) {
        return productRepository.findByFabricIgnoreCase(fabric);
    }

    // Filter products by brand
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandIgnoreCase(brand);
    }

    // Filter products by size
    public List<Product> getProductsBySize(String size) {
        return productRepository.findBySizeIgnoreCase(size);
    }

    // Filter products by color
    public List<Product> getProductsByColor(String color) {
        return productRepository.findByColorIgnoreCase(color);
    }

    // Basic validation
    private void validateProduct(Product product) {
        if (product.getName() == null ||
                product.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Product name is required");
        }

        if (product.getCategory() == null ||
                product.getCategory().isBlank()) {
            throw new IllegalArgumentException(
                    "Category is required");
        }

        if (product.getFabric() == null ||
                product.getFabric().isBlank()) {
            throw new IllegalArgumentException(
                    "Fabric is required");
        }

        if (product.getPrice() == null ||
                product.getPrice().signum() < 0) {
            throw new IllegalArgumentException(
                    "Price must be zero or greater");
        }

        if (product.getDiscountPercentage() == null ||
                product.getDiscountPercentage().compareTo(BigDecimal.ZERO) < 0 ||
                product.getDiscountPercentage().compareTo(
                        new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException(
                    "Discount must be between 0 and 100 percent");
        }

        if (product.getStockQuantity() == null ||
                product.getStockQuantity() < 0) {
            throw new IllegalArgumentException(
                    "Stock quantity must be zero or greater");
        }
    }
}
