package com.example.profitcalculator.mapper;

import org.springframework.stereotype.Component;

import com.example.profitcalculator.dto.CalculationDTO;
import com.example.profitcalculator.entity.Calculation;
import com.example.profitcalculator.entity.Shipment;

@Component
public class CalculationMapper {

    public CalculationDTO toDTO(Calculation calculation) {
        if (calculation == null) {
            return null;
        }
        return CalculationDTO.builder()
                .id(calculation.getId())
                .shipmentId(calculation.getShipment() != null ? calculation.getShipment().getId() : null)
                .income(calculation.getIncome())
                .cost(calculation.getCost())
                .profitOrLoss(calculation.getProfitOrLoss())
                .build();
    }

    public Calculation toEntity(CalculationDTO dto, Shipment shipment) {
        if (dto == null || shipment == null) {
            return null;
        }
        return Calculation.builder()
                .id(dto.getId())
                .shipment(shipment)
                .income(dto.getIncome())
                .cost(dto.getCost())
                .profitOrLoss(dto.getProfitOrLoss())
                .build();
    }
}
