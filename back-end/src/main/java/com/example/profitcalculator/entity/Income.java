package com.example.profitcalculator.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long shipmentId;
    private Double amount;

    // No-args constructor
    public Income() {
    }

    // All-args constructor
    public Income(Long id, Long shipmentId, Double amount) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.amount = amount;
    }

    // Getters and setters
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long shipmentId;
        private Double amount;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder shipmentId(Long shipmentId) {
            this.shipmentId = shipmentId;
            return this;
        }

        public Builder amount(Double amount) {
            this.amount = amount;
            return this;
        }

        public Income build() {
            return new Income(id, shipmentId, amount);
        }
    }
}
