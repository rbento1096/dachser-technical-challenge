package com.example.profitcalculator.mapper;

import com.example.profitcalculator.dto.CalculationDTO;
import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CalculationMapperTest {

    private CalculationMapper calculationMapper;

    @BeforeEach
    void setUp() {
        calculationMapper = new CalculationMapper();
    }

    @Test
    void toDTO_ShouldMapCalculationToDTO() {
        // Arrange
        Shipment shipment = Shipment.builder()
                .id(1L)
                .build();
        
        Calculation calculation = Calculation.builder()
                .id(1L)
                .income(100.0)
                .cost(50.0)
                .profitOrLoss(50.0)
                .shipment(shipment)
                .build();

        // Act
        CalculationDTO result = calculationMapper.toDTO(calculation);

        // Assert
        assertNotNull(result);
        assertEquals(calculation.getId(), result.getId());
        assertEquals(calculation.getIncome(), result.getIncome());
        assertEquals(calculation.getCost(), result.getCost());
        assertEquals(calculation.getProfitOrLoss(), result.getProfitOrLoss());
        assertEquals(calculation.getShipment().getId(), result.getShipmentId());
    }

    @Test
    void toDTO_WithNullCalculation_ShouldReturnNull() {
        // Act
        CalculationDTO result = calculationMapper.toDTO(null);

        // Assert
        assertNull(result);
    }

    @Test
    void toEntity_ShouldMapDTOToCalculation() {
        // Arrange
        Shipment shipment = Shipment.builder()
                .id(1L)
                .build();
        
        CalculationDTO dto = CalculationDTO.builder()
                .id(1L)
                .income(100.0)
                .cost(50.0)
                .profitOrLoss(50.0)
                .shipmentId(1L)
                .build();

        // Act
        Calculation result = calculationMapper.toEntity(dto, shipment);

        // Assert
        assertNotNull(result);
        assertEquals(dto.getId(), result.getId());
        assertEquals(dto.getIncome(), result.getIncome());
        assertEquals(dto.getCost(), result.getCost());
        assertEquals(dto.getProfitOrLoss(), result.getProfitOrLoss());
        assertEquals(shipment, result.getShipment());
    }

    @Test
    void toEntity_WithNullDTO_ShouldReturnNull() {
        // Arrange
        Shipment shipment = Shipment.builder()
                .id(1L)
                .build();

        // Act
        Calculation result = calculationMapper.toEntity(null, shipment);

        // Assert
        assertNull(result);
    }

    @Test
    void toEntity_WithNullShipment_ShouldReturnNull() {
        // Arrange
        CalculationDTO dto = CalculationDTO.builder()
                .id(1L)
                .income(100.0)
                .cost(50.0)
                .build();

        // Act
        Calculation result = calculationMapper.toEntity(dto, null);

        // Assert
        assertNull(result);
    }
}
