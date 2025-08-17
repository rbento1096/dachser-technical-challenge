package com.example.profitcalculator.service;

import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentService {
    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public List<Shipment> getAll() {
        return shipmentRepository.findAll();
    }

    public Shipment getById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    public Shipment create(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public void delete(Long id) {
        shipmentRepository.deleteById(id); // cascade deletes calculations
    }
}
