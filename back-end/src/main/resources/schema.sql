-- Shipments table
CREATE TABLE shipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY
);

-- Calculations table
CREATE TABLE calculation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT NOT NULL,
    income DOUBLE NOT NULL DEFAULT 0,
    cost DOUBLE NOT NULL DEFAULT 0,
    profit_or_loss DOUBLE,
    CONSTRAINT fk_shipment FOREIGN KEY (shipment_id)
        REFERENCES shipment(id) ON DELETE CASCADE
);
