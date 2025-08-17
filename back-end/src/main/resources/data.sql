-- Insert initial shipments (let H2 auto-generate IDs)
INSERT INTO shipment DEFAULT VALUES;
INSERT INTO shipment DEFAULT VALUES;

-- Insert initial calculations
INSERT INTO calculation (shipment_id, income, cost, profit_or_loss)
VALUES (1, 1000, 500, 500),
       (1, 200, 300, -100),
       (2, 1500, 1000, 500);
