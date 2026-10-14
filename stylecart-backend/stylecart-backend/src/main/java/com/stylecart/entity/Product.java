
package com.stylecart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 100)
    private String fabric;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    @Column(length = 100)
    private String brand;

    @Column(length = 50)
    private String size;

    @Column(length = 50)
    private String color;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Integer stockQuantity;

    // Default constructor required by JPA
    public Product() {
    }

    // Parameterized constructor
    public Product(String name, String category, String fabric,
                   BigDecimal price, String description,
                   String imageUrl, Integer stockQuantity) {
        this.name = name;
        this.category = category;
        this.fabric = fabric;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.stockQuantity = stockQuantity;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFabric() {
        return fabric;
    }

    public void setFabric(String fabric) {
        this.fabric = fabric;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        if (discountPercentage == null
                || discountPercentage.compareTo(BigDecimal.ZERO) < 0
                || discountPercentage.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException(
                    "Discount must be between 0 and 100 percent");
        }

        this.discountPercentage = discountPercentage;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    // Calculate the final selling price after discount
    public BigDecimal getDiscountedPrice() {
        if (price == null) {
            return BigDecimal.ZERO.setScale(2);
        }

        BigDecimal discount = discountPercentage
                .multiply(price)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        return price.subtract(discount)
                .setScale(2, RoundingMode.HALF_UP);
    }

    // Calculate customer savings
    public BigDecimal getSavingsAmount() {
        if (price == null) {
            return BigDecimal.ZERO.setScale(2);
        }

        return price.subtract(getDiscountedPrice())
                .setScale(2, RoundingMode.HALF_UP);
    }
}
