
package com.stylecart.repository;

import com.stylecart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    // Find products by category, such as Kurtis or Sarees
    List<Product> findByCategoryIgnoreCase(String category);

    // Find products by fabric, such as Cotton or Silk
    List<Product> findByFabricIgnoreCase(String fabric);
    List<Product> findByBrandIgnoreCase(String brand);
    List<Product> findBySizeIgnoreCase(String size);

    List<Product> findByColorIgnoreCase(String color);

}
