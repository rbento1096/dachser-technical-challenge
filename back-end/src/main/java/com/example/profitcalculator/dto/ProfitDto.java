package com.example.profitcalculator.dto;

public class ProfitDto {
    private Long shipmentId;
    private Double totalIncome;
    private Double totalCosts;
    private Double profit;

    public ProfitDto() {
    }

    public ProfitDto(Long shipmentId, Double totalIncome, Double totalCosts, Double profit) {
        this.shipmentId = shipmentId;
        this.totalIncome = totalIncome;
        this.totalCosts = totalCosts;
        this.profit = profit;
    }

    public Long getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(Long shipmentId) {
        this.shipmentId = shipmentId;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalCosts() {
        return totalCosts;
    }

    public void setTotalCosts(Double totalCosts) {
        this.totalCosts = totalCosts;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    // Manual Builder pattern implementation
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long shipmentId;
        private Double totalIncome;
        private Double totalCosts;
        private Double profit;

        public Builder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
        return this;
        }

        public Builder totalIncome(Double totalIncome) {
            this.totalIncome = totalIncome;
        return this;
        }

        public Builder totalCosts(Double totalCosts) {
            this.totalCosts = totalCosts;
        return this;
        }

        public Builder profit(Double profit) {
            this.profit = profit;
        return this;
        }

        public ProfitDto build() {
            return new ProfitDto(shipmentId, totalIncome, totalCosts, profit);
        }
    }
}
