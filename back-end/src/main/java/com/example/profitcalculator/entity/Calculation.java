package com.example.profitcalculator.entity;

import jakarta.persistence.*;

@Entity
public class Calculation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    private Double income;
    private Double cost;
    private Double profitOrLoss;

    // Constructors
    public Calculation() {}
    public Calculation(Long id, Shipment shipment, Double income, Double cost, Double profitOrLoss) {
        this.id = id;
        this.shipment = shipment;
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

    public Shipment getShipment() {
        return shipment;
    }
    public void setShipment(Shipment shipment) {
        this.shipment = shipment;
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
    public static CalculationBuilder builder() {
        return new CalculationBuilder();
    }

    public static class CalculationBuilder {
        private Long id;
        private Shipment shipment;
        private Double income;
        private Double cost;
        private Double profitOrLoss;

        public CalculationBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CalculationBuilder shipment(Shipment shipment) {
            this.shipment = shipment;
            return this;
        }

        public CalculationBuilder income(Double income) {
            this.income = income;
            return this;
        }

        public CalculationBuilder cost(Double cost) {
            this.cost = cost;
            return this;
        }

        public CalculationBuilder profitOrLoss(Double profitOrLoss) {
            this.profitOrLoss = profitOrLoss;
            return this;
        }

        public Calculation build() {
            return new Calculation(id, shipment, income, cost, profitOrLoss);
        }
    }
}
