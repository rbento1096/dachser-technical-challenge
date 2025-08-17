package com.example.profitcalculator.dto;

public class ShipmentDTO {
    private Long id;

    // Constructors
    public ShipmentDTO() {}
    public ShipmentDTO(Long id) {
        this.id = id;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    // Builder
    public static ShipmentDTOBuilder builder() {
        return new ShipmentDTOBuilder();
    }

    public static class ShipmentDTOBuilder {
        private Long id;

        public ShipmentDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ShipmentDTO build() {
            return new ShipmentDTO(id);
        }
    }
}
