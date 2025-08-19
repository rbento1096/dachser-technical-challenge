package com.example.profitcalculator.service;

import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.exception.BadRequestException;
import com.example.profitcalculator.exception.ResourceNotFoundException;
import com.example.profitcalculator.repository.CalculationRepository;
import com.example.profitcalculator.repository.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CalculationServiceTest {

    @Mock
    private CalculationRepository calculationRepository;

    @Mock
    private ShipmentRepository shipmentRepository;

    @InjectMocks
    private CalculationService calculationService;

    private Shipment testShipment;
    private Calculation testCalculation;

    @BeforeEach
    void setUp() {
        testShipment = Shipment.builder()
                .id(1L)
                .build();
        
        testCalculation = Calculation.builder()
                .id(1L)
                .income(100.0)
                .cost(50.0)
                .profitOrLoss(50.0)
                .shipment(testShipment)
                .build();
    }

    @Test
    void getByShipmentId_WhenShipmentExists_ShouldReturnCalculations() {
        // Arrange
        Long shipmentId = 1L;
        List<Calculation> expectedCalculations = Arrays.asList(testCalculation);
        
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.of(testShipment));
        when(calculationRepository.findByShipment(testShipment)).thenReturn(expectedCalculations);

        // Act
        List<Calculation> result = calculationService.getByShipmentId(shipmentId);

        // Assert
        assertEquals(expectedCalculations, result);
        verify(shipmentRepository, times(1)).findById(shipmentId);
        verify(calculationRepository, times(1)).findByShipment(testShipment);
    }

    @Test
    void getByShipmentId_WhenShipmentDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        Long shipmentId = 999L;
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> calculationService.getByShipmentId(shipmentId)
        );
        
        assertEquals("Shipment not found with id : '999'", exception.getMessage());
        verify(shipmentRepository, times(1)).findById(shipmentId);
        verify(calculationRepository, never()).findByShipment(any());
    }

    @Test
    void create_WithValidData_ShouldCreateAndReturnCalculation() {
        // Arrange
        Long shipmentId = 1L;
        Calculation newCalculation = Calculation.builder()
                .income(100.0)
                .cost(50.0)
                .build();
        
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.of(testShipment));
        when(calculationRepository.save(any(Calculation.class))).thenReturn(testCalculation);

        // Act
        Calculation result = calculationService.create(shipmentId, newCalculation);

        // Assert
        assertEquals(testCalculation, result);
        assertEquals(testShipment, newCalculation.getShipment());
        assertEquals(50.0, newCalculation.getProfitOrLoss());
        verify(shipmentRepository, times(1)).findById(shipmentId);
        verify(calculationRepository, times(1)).save(newCalculation);
    }

    @Test
    void create_WhenShipmentDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        Long shipmentId = 999L;
        Calculation newCalculation = Calculation.builder()
                .income(100.0)
                .cost(50.0)
                .build();
        
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> calculationService.create(shipmentId, newCalculation)
        );
        
        assertEquals("Shipment not found with id : '999'", exception.getMessage());
        verify(shipmentRepository, times(1)).findById(shipmentId);
        verify(calculationRepository, never()).save(any());
    }

    @Test
    void create_WithBothIncomeAndCostZero_ShouldThrowBadRequestException() {
        // Arrange
        Long shipmentId = 1L;
        Calculation newCalculation = Calculation.builder()
                .income(0.0)
                .cost(0.0)
                .build();

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> calculationService.create(shipmentId, newCalculation)
        );
        
        assertEquals("Income and Cost cannot both be 0", exception.getMessage());
        verify(shipmentRepository, never()).findById(any());
        verify(calculationRepository, never()).save(any());
    }

    @Test
    void create_WithBothIncomeAndCostNull_ShouldThrowBadRequestException() {
        // Arrange
        Long shipmentId = 1L;
        Calculation newCalculation = Calculation.builder()
                .income(null)
                .cost(null)
                .build();

        // Act & Assert
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> calculationService.create(shipmentId, newCalculation)
        );
        
        assertEquals("Income and Cost cannot both be 0", exception.getMessage());
        verify(shipmentRepository, never()).findById(any());
        verify(calculationRepository, never()).save(any());
    }

    @Test
    void create_WithIncomeZeroAndCostPositive_ShouldCreateSuccessfully() {
        // Arrange
        Long shipmentId = 1L;
        Calculation newCalculation = Calculation.builder()
                .income(0.0)
                .cost(50.0)
                .build();
        
        Calculation expectedCalculation = Calculation.builder()
                .id(1L)
                .income(0.0)
                .cost(50.0)
                .profitOrLoss(-50.0)
                .shipment(testShipment)
                .build();
        
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.of(testShipment));
        when(calculationRepository.save(any(Calculation.class))).thenReturn(expectedCalculation);

        // Act
        Calculation result = calculationService.create(shipmentId, newCalculation);

        // Assert
        assertEquals(expectedCalculation, result);
        assertEquals(testShipment, newCalculation.getShipment());
        assertEquals(-50.0, newCalculation.getProfitOrLoss());
        verify(shipmentRepository, times(1)).findById(shipmentId);
        verify(calculationRepository, times(1)).save(newCalculation);
    }

    @Test
    void create_WithCostZeroAndIncomePositive_ShouldCreateSuccessfully() {
        // Arrange
        Long shipmentId = 1L;
        Calculation newCalculation = Calculation.builder()
                .income(100.0)
                .cost(0.0)
                .build();
        
        Calculation expectedCalculation = Calculation.builder()
                .id(1L)
                .income(100.0)
                .cost(0.0)
                .profitOrLoss(100.0)
                .shipment(testShipment)
                .build();
        
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.of(testShipment));
        when(calculationRepository.save(any(Calculation.class))).thenReturn(expectedCalculation);

        // Act
        Calculation result = calculationService.create(shipmentId, newCalculation);

        // Assert
        assertEquals(expectedCalculation, result);
        assertEquals(testShipment, newCalculation.getShipment());
        assertEquals(100.0, newCalculation.getProfitOrLoss());
        verify(shipmentRepository, times(1)).findById(shipmentId);
        verify(calculationRepository, times(1)).save(newCalculation);
    }

    @Test
    void delete_WhenCalculationExists_ShouldDeleteSuccessfully() {
        // Arrange
        Long calculationId = 1L;
        when(calculationRepository.existsById(calculationId)).thenReturn(true);
        doNothing().when(calculationRepository).deleteById(calculationId);

        // Act
        calculationService.delete(calculationId);

        // Assert
        verify(calculationRepository, times(1)).existsById(calculationId);
        verify(calculationRepository, times(1)).deleteById(calculationId);
    }

    @Test
    void delete_WhenCalculationDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        Long calculationId = 999L;
        when(calculationRepository.existsById(calculationId)).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> calculationService.delete(calculationId)
        );
        
        assertEquals("Calculation not found with id : '999'", exception.getMessage());
        verify(calculationRepository, times(1)).existsById(calculationId);
        verify(calculationRepository, never()).deleteById(any());
    }
}
