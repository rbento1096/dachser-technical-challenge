package com.example.profitcalculator.service;

import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.repository.CalculationRepository;
import com.example.profitcalculator.repository.ShipmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    public List<Calculation> getByShipmentId(Long shipmentId) {
        Shipment shipment = getShipmentById(shipmentId);
        return calculationRepository.findByShipment(shipment);
    }

    public Calculation create(Long shipmentId, Calculation calculation) {
        if ((calculation.getIncome() == null ? 0 : calculation.getIncome()) <= 0 &&
                (calculation.getCost() == null ? 0 : calculation.getCost()) <= 0) {
            throw new IllegalArgumentException("Income and Cost cannot both be 0");
        }

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found"));

        calculation.setShipment(shipment);
        calculation.setProfitOrLoss(calculation.getIncome() - calculation.getCost());

        return calculationRepository.save(calculation);
    }


    public void delete(Long id) {
        calculationRepository.deleteById(id);
    }
}
