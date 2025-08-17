package com.example.profitcalculator.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Calculation> calculations;

    // Constructors
    public Shipment() {}
    public Shipment(Long id, List<Calculation> calculations) {
        this.id = id;
        this.calculations = calculations;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public List<Calculation> getCalculations() {
        return calculations;
    }
    public void setCalculations(List<Calculation> calculations) {
        this.calculations = calculations;
    }

    // Builder
    public static ShipmentBuilder builder() {
        return new ShipmentBuilder();
    }

    public static class ShipmentBuilder {
        private Long id;
        private List<Calculation> calculations;

        public ShipmentBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ShipmentBuilder calculations(List<Calculation> calculations) {
            this.calculations = calculations;
            return this;
        }

        public Shipment build() {
            return new Shipment(id, calculations);
        }
    }
}
