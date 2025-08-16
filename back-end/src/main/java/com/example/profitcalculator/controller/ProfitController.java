package com.example.profitcalculator.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.profitcalculator.dto.ProfitDto;
import com.example.profitcalculator.service.ProfitService;

@RestController
@RequestMapping("/api/profit")
public class ProfitController {

    private final ProfitService profitService;

    public ProfitController(ProfitService profitService) {
        this.profitService = profitService;
    }

    @GetMapping("/{shipmentId}")
    public ProfitDto getProfit(@PathVariable Long shipmentId) {
        return profitService.calculateProfit(shipmentId);
    }
}
