package com.example.profitcalculator.mapper;

import com.example.profitcalculator.dto.ShipmentDTO;
import com.example.profitcalculator.entity.Shipment;
import org.springframework.stereotype.Component;

@Component
public class ShipmentMapper {

    public ShipmentDTO toDTO(Shipment shipment) {
        return ShipmentDTO.builder()
                .id(shipment.getId())
                .build();
    }

    public Shipment toEntity(ShipmentDTO dto) {
        return Shipment.builder()
                .id(dto.getId())
                .build();
    }
}
