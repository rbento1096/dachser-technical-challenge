package com.example.profitcalculator.service;

import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.exception.ResourceNotFoundException;
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
class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @InjectMocks
    private ShipmentService shipmentService;

    private Shipment testShipment;

    @BeforeEach
    void setUp() {
        testShipment = Shipment.builder()
                .id(1L)
                .build();
    }

    @Test
    void getAll_ShouldReturnAllShipments() {
        // Arrange
        List<Shipment> expectedShipments = Arrays.asList(
                Shipment.builder().id(1L).build(),
                Shipment.builder().id(2L).build()
        );
        when(shipmentRepository.findAll()).thenReturn(expectedShipments);

        // Act
        List<Shipment> result = shipmentService.getAll();

        // Assert
        assertEquals(expectedShipments, result);
        verify(shipmentRepository, times(1)).findAll();
    }

    @Test
    void getById_WhenShipmentExists_ShouldReturnShipment() {
        // Arrange
        Long shipmentId = 1L;
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.of(testShipment));

        // Act
        Shipment result = shipmentService.getById(shipmentId);

        // Assert
        assertEquals(testShipment, result);
        verify(shipmentRepository, times(1)).findById(shipmentId);
    }

    @Test
    void getById_WhenShipmentDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        Long shipmentId = 999L;
        when(shipmentRepository.findById(shipmentId)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> shipmentService.getById(shipmentId)
        );
        
        assertEquals("Shipment not found with id : '999'", exception.getMessage());
        verify(shipmentRepository, times(1)).findById(shipmentId);
    }

    @Test
    void create_ShouldSaveAndReturnShipment() {
        // Arrange
        Shipment newShipment = Shipment.builder().build();
        when(shipmentRepository.save(any(Shipment.class))).thenReturn(testShipment);

        // Act
        Shipment result = shipmentService.create(newShipment);

        // Assert
        assertEquals(testShipment, result);
        verify(shipmentRepository, times(1)).save(newShipment);
    }

    @Test
    void delete_WhenShipmentExists_ShouldDeleteSuccessfully() {
        // Arrange
        Long shipmentId = 1L;
        when(shipmentRepository.existsById(shipmentId)).thenReturn(true);
        doNothing().when(shipmentRepository).deleteById(shipmentId);

        // Act
        shipmentService.delete(shipmentId);

        // Assert
        verify(shipmentRepository, times(1)).existsById(shipmentId);
        verify(shipmentRepository, times(1)).deleteById(shipmentId);
    }

    @Test
    void delete_WhenShipmentDoesNotExist_ShouldThrowResourceNotFoundException() {
        // Arrange
        Long shipmentId = 999L;
        when(shipmentRepository.existsById(shipmentId)).thenReturn(false);

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> shipmentService.delete(shipmentId)
        );
        
        assertEquals("Shipment not found with id : '999'", exception.getMessage());
        verify(shipmentRepository, times(1)).existsById(shipmentId);
        verify(shipmentRepository, never()).deleteById(any());
    }
}
