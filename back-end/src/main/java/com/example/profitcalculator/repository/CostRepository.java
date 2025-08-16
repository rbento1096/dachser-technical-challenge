package com.example.profitcalculator.repository;

import com.example.profitcalculator.entity.Cost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CostRepository extends JpaRepository<Cost, Long> {
    List<Cost> findByShipmentId(Long shipmentId);
}
