package com.example.profitcalculator.mapper;

import com.example.profitcalculator.dto.ProfitDto;

public class ProfitMapper {
    public static ProfitDto map(Long shipmentId, Double totalIncome, Double totalCosts) {
        return ProfitDto.builder()
                .shipmentId(shipmentId)
                .totalIncome(totalIncome)
                .totalCosts(totalCosts)
                .profit(totalIncome - totalCosts)
                .build();
    }
}
