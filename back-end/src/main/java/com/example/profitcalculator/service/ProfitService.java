package com.example.profitcalculator.service;

import org.springframework.stereotype.Service;

import com.example.profitcalculator.dto.ProfitDto;
import com.example.profitcalculator.mapper.ProfitMapper;
import com.example.profitcalculator.repository.CostRepository;
import com.example.profitcalculator.repository.IncomeRepository;

@Service
public class ProfitService {

    private final IncomeRepository incomeRepository;
    private final CostRepository costRepository;

    // Constructor for dependency injection
    public ProfitService(IncomeRepository incomeRepository, CostRepository costRepository) {
        this.incomeRepository = incomeRepository;
        this.costRepository = costRepository;
    }

    public ProfitDto calculateProfit(Long shipmentId) {
        double totalIncome = incomeRepository.findByShipmentId(shipmentId)
                .stream()
                .mapToDouble(i -> i.getAmount())
                .sum();

        double totalCosts = costRepository.findByShipmentId(shipmentId)
                .stream()
                .mapToDouble(c -> c.getAmount())
                .sum();

        return ProfitMapper.map(shipmentId, totalIncome, totalCosts);
    }
}
