package com.example.profitcalculator.repository;

import com.example.profitcalculator.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {}
