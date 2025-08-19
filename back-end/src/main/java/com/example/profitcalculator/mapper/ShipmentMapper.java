package com.example.profitcalculator.mapper;

import org.springframework.stereotype.Component;

import com.example.profitcalculator.dto.ShipmentDTO;
import com.example.profitcalculator.entity.Shipment;

@Component
public class ShipmentMapper {

    public ShipmentDTO toDTO(Shipment shipment) {
        if (shipment == null) {
            return null;
        }
        return ShipmentDTO.builder()
                .id(shipment.getId())
                .build();
    }

    public Shipment toEntity(ShipmentDTO dto) {
        if (dto == null) {
            return null;
        }
        return Shipment.builder()
                .id(dto.getId())
                .build();
    }
}
