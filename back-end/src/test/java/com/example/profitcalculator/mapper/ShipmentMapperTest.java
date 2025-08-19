package com.example.profitcalculator.mapper;

import com.example.profitcalculator.dto.ShipmentDTO;
import com.example.profitcalculator.entity.Shipment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ShipmentMapperTest {

    private ShipmentMapper shipmentMapper;

    @BeforeEach
    void setUp() {
        shipmentMapper = new ShipmentMapper();
    }

    @Test
    void toDTO_ShouldMapShipmentToDTO() {
        // Arrange
        Shipment shipment = Shipment.builder()
                .id(1L)
                .build();

        // Act
        ShipmentDTO result = shipmentMapper.toDTO(shipment);

        // Assert
        assertNotNull(result);
        assertEquals(shipment.getId(), result.getId());
    }

    @Test
    void toDTO_WithNullShipment_ShouldReturnNull() {
        // Act
        ShipmentDTO result = shipmentMapper.toDTO(null);

        // Assert
        assertNull(result);
    }

    @Test
    void toEntity_ShouldMapDTOToShipment() {
        // Arrange
        ShipmentDTO dto = ShipmentDTO.builder()
                .id(1L)
                .build();

        // Act
        Shipment result = shipmentMapper.toEntity(dto);

        // Assert
        assertNotNull(result);
        assertEquals(dto.getId(), result.getId());
    }

    @Test
    void toEntity_WithNullDTO_ShouldReturnNull() {
        // Act
        Shipment result = shipmentMapper.toEntity(null);

        // Assert
        assertNull(result);
    }
}
