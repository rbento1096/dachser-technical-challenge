package com.example.profitcalculator.controller;

import com.example.profitcalculator.dto.CalculationDTO;
import com.example.profitcalculator.dto.ShipmentDTO;
import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.mapper.CalculationMapper;
import com.example.profitcalculator.mapper.ShipmentMapper;
import com.example.profitcalculator.service.CalculationService;
import com.example.profitcalculator.service.ShipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/profit/shipments")
public class ProfitController {

    private final ShipmentService shipmentService;
    private final CalculationService calculationService;
    private final ShipmentMapper shipmentMapper;
    private final CalculationMapper calculationMapper;

    public ProfitController(ShipmentService shipmentService,
                            CalculationService calculationService,
                            ShipmentMapper shipmentMapper,
                            CalculationMapper calculationMapper) {
        this.shipmentService = shipmentService;
        this.calculationService = calculationService;
        this.shipmentMapper = shipmentMapper;
        this.calculationMapper = calculationMapper;
    }

    //
    // Shipments
    //
    @GetMapping
    public List<ShipmentDTO> getAllShipments() {
        return shipmentService.getAll()
                .stream()
                .map(shipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ShipmentDTO createShipment() {
        Shipment shipment = shipmentService.create(Shipment.builder().build());
        return shipmentMapper.toDTO(shipment);
    }

    @GetMapping("/{shipmentId}")
    public ShipmentDTO getShipmentById(@PathVariable Long shipmentId) {
        Shipment shipment = shipmentService.getById(shipmentId);
        return shipmentMapper.toDTO(shipment);
    }

    @DeleteMapping("/{shipmentId}")
    public void deleteShipment(@PathVariable Long shipmentId) {
        shipmentService.delete(shipmentId);
    }

    //
    // Calculations
    //
    @GetMapping("/{shipmentId}/calculations")
    public List<CalculationDTO> getCalculationsByShipment(@PathVariable Long shipmentId) {
        return calculationService.getByShipmentId(shipmentId)
                .stream()
                .map(calculationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping("/{shipmentId}/calculations")
    public CalculationDTO createCalculation(@PathVariable Long shipmentId,
                                            @RequestBody CalculationDTO dto) {
        // Convert DTO to entity
        Shipment shipment = shipmentService.getById(shipmentId); // ensures shipment exists
        Calculation calculation = calculationMapper.toEntity(dto, shipment);
        Calculation saved = calculationService.create(shipmentId, calculation);
        return calculationMapper.toDTO(saved);
    }

    @DeleteMapping("/{shipmentId}/calculations/{calculationId}")
    public void deleteCalculation(@PathVariable Long calculationId) {
        calculationService.delete(calculationId);
    }
}
