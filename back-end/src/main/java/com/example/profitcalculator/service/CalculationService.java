package com.example.profitcalculator.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.exception.BadRequestException;
import com.example.profitcalculator.exception.ResourceNotFoundException;
import com.example.profitcalculator.repository.CalculationRepository;
import com.example.profitcalculator.repository.ShipmentRepository;

@Service
public class CalculationService {
    private final CalculationRepository calculationRepository;
    private final ShipmentRepository shipmentRepository;

    public CalculationService(CalculationRepository calculationRepository, ShipmentRepository shipmentRepository) {
        this.calculationRepository = calculationRepository;
        this.shipmentRepository = shipmentRepository;
    }

    private Shipment getShipmentById(Long shipmentId) {
        return shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "id", shipmentId));
    }

    public List<Calculation> getByShipmentId(Long shipmentId) {
        Shipment shipment = getShipmentById(shipmentId);
        return calculationRepository.findByShipment(shipment);
    }

    public Calculation create(Long shipmentId, Calculation calculation) {
        if ((calculation.getIncome() == null ? 0 : calculation.getIncome()) <= 0 &&
                (calculation.getCost() == null ? 0 : calculation.getCost()) <= 0) {
            throw new BadRequestException("Income and Cost cannot both be 0");
        }

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment", "id", shipmentId));

        calculation.setShipment(shipment);
        calculation.setProfitOrLoss(calculation.getIncome() - calculation.getCost());

        return calculationRepository.save(calculation);
    }


    public void delete(Long id) {
        // Check if calculation exists before deleting
        if (!calculationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Calculation", "id", id);
        }
        calculationRepository.deleteById(id);
    }
}
