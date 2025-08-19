package com.example.profitcalculator.service;

import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "id", id));
    }

    public Shipment create(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public void delete(Long id) {
        // Check if shipment exists before deleting
        if (!shipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shipment", "id", id);
        }
        shipmentRepository.deleteById(id); // cascade deletes calculations
    }
}
