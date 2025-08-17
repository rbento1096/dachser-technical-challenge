package com.example.profitcalculator.dto;

public class CalculationDTO {
    private Long id;
    private Long shipmentId;
    private Double income;
    private Double cost;
    private Double profitOrLoss;

    // Constructors
    public CalculationDTO() {}
    public CalculationDTO(Long id, Long shipmentId, Double income, Double cost, Double profitOrLoss) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.income = income;
        this.cost = cost;
        this.profitOrLoss = profitOrLoss;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getShipmentId() {
        return shipmentId;
    }
    public void setShipmentId(Long shipmentId) {
        this.shipmentId = shipmentId;
    }

    public Double getIncome() {
        return income;
    }
    public void setIncome(Double income) {
        this.income = income;
    }

    public Double getCost() {
        return cost;
    }
    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Double getProfitOrLoss() {
        return profitOrLoss;
    }
    public void setProfitOrLoss(Double profitOrLoss) {
        this.profitOrLoss = profitOrLoss;
    }


    // Builder
    public static CalculationDTOBuilder builder() {
        return new CalculationDTOBuilder();
    }

    public static class CalculationDTOBuilder {
        private Long id;
        private Long shipmentId;
        private Double income;
        private Double cost;
        private Double profitOrLoss;

        public CalculationDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }
        public CalculationDTOBuilder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }
        public CalculationDTOBuilder income(Double income) {
            this.income = income;
            return this;
        }
        public CalculationDTOBuilder cost(Double cost) {
            this.cost = cost;
            return this;
        }
        public CalculationDTOBuilder profitOrLoss(Double profitOrLoss) {
            this.profitOrLoss = profitOrLoss;
            return this;
        }

        public CalculationDTO build() {
            return new CalculationDTO(id, shipmentId, income, cost, profitOrLoss);
        }
    }
}
