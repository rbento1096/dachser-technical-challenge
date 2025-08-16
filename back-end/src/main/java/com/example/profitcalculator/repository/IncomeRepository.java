package com.example.profitcalculator.repository;

import com.example.profitcalculator.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByShipmentId(Long shipmentId);
}
