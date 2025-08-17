package com.example.profitcalculator.repository;

import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalculationRepository extends JpaRepository<Calculation, Long> {
    List<Calculation> findByShipment(Shipment shipment);
}
