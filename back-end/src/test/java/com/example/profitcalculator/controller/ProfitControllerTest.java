package com.example.profitcalculator.controller;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.profitcalculator.dto.CalculationDTO;
import com.example.profitcalculator.dto.ShipmentDTO;
import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;
import com.example.profitcalculator.exception.ResourceNotFoundException;
import com.example.profitcalculator.mapper.CalculationMapper;
import com.example.profitcalculator.mapper.ShipmentMapper;
import com.example.profitcalculator.service.CalculationService;
import com.example.profitcalculator.service.ShipmentService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(ProfitController.class)
class ProfitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ShipmentService shipmentService;

    @MockBean
    private CalculationService calculationService;

    @MockBean
    private ShipmentMapper shipmentMapper;

    @MockBean
    private CalculationMapper calculationMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Shipment testShipment;
    private ShipmentDTO testShipmentDTO;
    private Calculation testCalculation;
    private CalculationDTO testCalculationDTO;

    @BeforeEach
    void setUp() {
        testShipment = Shipment.builder()
                .id(1L)
                .build();

        testShipmentDTO = ShipmentDTO.builder()
                .id(1L)
                .build();

        testCalculation = Calculation.builder()
                .id(1L)
                .income(100.0)
                .cost(50.0)
                .profitOrLoss(50.0)
                .shipment(testShipment)
                .build();

        testCalculationDTO = CalculationDTO.builder()
                .id(1L)
                .income(100.0)
                .cost(50.0)
                .profitOrLoss(50.0)
                .shipmentId(1L)
                .build();
    }

    @Test
    void getAllShipments_ShouldReturnAllShipments() throws Exception {
        // Arrange
        List<Shipment> shipments = Arrays.asList(testShipment);
        List<ShipmentDTO> shipmentDTOs = Arrays.asList(testShipmentDTO);

        when(shipmentService.getAll()).thenReturn(shipments);
        when(shipmentMapper.toDTO(testShipment)).thenReturn(testShipmentDTO);

        // Act & Assert
        mockMvc.perform(get("/api/profit/shipments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(shipmentService, times(1)).getAll();
        verify(shipmentMapper, times(1)).toDTO(testShipment);
    }

    @Test
    void createShipment_ShouldReturnCreatedShipment() throws Exception {
        // Arrange
        when(shipmentService.create(any(Shipment.class))).thenReturn(testShipment);
        when(shipmentMapper.toDTO(testShipment)).thenReturn(testShipmentDTO);

        // Act & Assert
        mockMvc.perform(post("/api/profit/shipments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(shipmentService, times(1)).create(any(Shipment.class));
        verify(shipmentMapper, times(1)).toDTO(testShipment);
    }

    @Test
    void getShipmentById_WhenShipmentExists_ShouldReturnShipment() throws Exception {
        // Arrange
        Long shipmentId = 1L;
        when(shipmentService.getById(shipmentId)).thenReturn(testShipment);
        when(shipmentMapper.toDTO(testShipment)).thenReturn(testShipmentDTO);

        // Act & Assert
        mockMvc.perform(get("/api/profit/shipments/{shipmentId}", shipmentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(shipmentService, times(1)).getById(shipmentId);
        verify(shipmentMapper, times(1)).toDTO(testShipment);
    }

    @Test
    void getShipmentById_WhenShipmentDoesNotExist_ShouldReturn404() throws Exception {
        // Arrange
        Long shipmentId = 999L;
        when(shipmentService.getById(shipmentId))
                .thenThrow(new ResourceNotFoundException("Shipment", "id", shipmentId));

        // Act & Assert
        mockMvc.perform(get("/api/profit/shipments/{shipmentId}", shipmentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Shipment not found with id : '999'"));

        verify(shipmentService, times(1)).getById(shipmentId);
    }

    @Test
    void deleteShipment_WhenShipmentExists_ShouldReturn200() throws Exception {
        // Arrange
        Long shipmentId = 1L;
        doNothing().when(shipmentService).delete(shipmentId);

        // Act & Assert
        mockMvc.perform(delete("/api/profit/shipments/{shipmentId}", shipmentId))
                .andExpect(status().isOk());

        verify(shipmentService, times(1)).delete(shipmentId);
    }

    @Test
    void deleteShipment_WhenShipmentDoesNotExist_ShouldReturn404() throws Exception {
        // Arrange
        Long shipmentId = 999L;
        doThrow(new ResourceNotFoundException("Shipment", "id", shipmentId))
                .when(shipmentService).delete(shipmentId);

        // Act & Assert
        mockMvc.perform(delete("/api/profit/shipments/{shipmentId}", shipmentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Shipment not found with id : '999'"));

        verify(shipmentService, times(1)).delete(shipmentId);
    }

    @Test
    void getCalculationsByShipment_WhenShipmentExists_ShouldReturnCalculations() throws Exception {
        // Arrange
        Long shipmentId = 1L;
        List<Calculation> calculations = Arrays.asList(testCalculation);
        List<CalculationDTO> calculationDTOs = Arrays.asList(testCalculationDTO);

        when(calculationService.getByShipmentId(shipmentId)).thenReturn(calculations);
        when(calculationMapper.toDTO(testCalculation)).thenReturn(testCalculationDTO);

        // Act & Assert
        mockMvc.perform(get("/api/profit/shipments/{shipmentId}/calculations", shipmentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].income").value(100.0))
                .andExpect(jsonPath("$[0].cost").value(50.0))
                .andExpect(jsonPath("$[0].profitOrLoss").value(50.0));

        verify(calculationService, times(1)).getByShipmentId(shipmentId);
        verify(calculationMapper, times(1)).toDTO(testCalculation);
    }

    @Test
    void getCalculationsByShipment_WhenShipmentDoesNotExist_ShouldReturn404() throws Exception {
        // Arrange
        Long shipmentId = 999L;
        when(calculationService.getByShipmentId(shipmentId))
                .thenThrow(new ResourceNotFoundException("Shipment", "id", shipmentId));

        // Act & Assert
        mockMvc.perform(get("/api/profit/shipments/{shipmentId}/calculations", shipmentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Shipment not found with id : '999'"));

        verify(calculationService, times(1)).getByShipmentId(shipmentId);
    }

    @Test
    void deleteCalculation_WhenCalculationExists_ShouldReturn200() throws Exception {
        // Arrange
        Long calculationId = 1L;
        doNothing().when(calculationService).delete(calculationId);

        // Act & Assert
        mockMvc.perform(delete("/api/profit/shipments/1/calculations/{calculationId}", calculationId))
                .andExpect(status().isOk());

        verify(calculationService, times(1)).delete(calculationId);
    }

    @Test
    void deleteCalculation_WhenCalculationDoesNotExist_ShouldReturn404() throws Exception {
        // Arrange
        Long calculationId = 999L;
        doThrow(new ResourceNotFoundException("Calculation", "id", calculationId))
                .when(calculationService).delete(calculationId);

        // Act & Assert
        mockMvc.perform(delete("/api/profit/shipments/1/calculations/{calculationId}", calculationId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Calculation not found with id : '999'"));

        verify(calculationService, times(1)).delete(calculationId);
    }
}
