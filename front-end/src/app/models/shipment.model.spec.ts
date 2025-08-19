import { Shipment } from './shipment.model';

describe('Shipment Model', () => {
  it('should create a valid shipment object', () => {
    const shipment: Shipment = {
      id: 1
    };

    expect(shipment.id).toBe(1);
  });

  it('should handle different ID values', () => {
    const shipments: Shipment[] = [
      { id: 1 },
      { id: 2 },
      { id: 999999 }
    ];

    expect(shipments[0].id).toBe(1);
    expect(shipments[1].id).toBe(2);
    expect(shipments[2].id).toBe(999999);
  });

  it('should handle zero ID', () => {
    const shipment: Shipment = {
      id: 0
    };

    expect(shipment.id).toBe(0);
  });

  it('should handle negative ID', () => {
    const shipment: Shipment = {
      id: -1
    };

    expect(shipment.id).toBe(-1);
  });

  it('should maintain data integrity', () => {
    const originalShipment: Shipment = {
      id: 1
    };

    // Create a copy
    const copiedShipment: Shipment = { ...originalShipment };

    // Modify the copy
    copiedShipment.id = 2;

    // Original should remain unchanged
    expect(originalShipment.id).toBe(1);

    // Copy should have new value
    expect(copiedShipment.id).toBe(2);
  });

  it('should handle array operations', () => {
    const shipments: Shipment[] = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    // Test array methods
    expect(shipments.length).toBe(3);
    expect(shipments[0].id).toBe(1);
    expect(shipments[1].id).toBe(2);
    expect(shipments[2].id).toBe(3);

    // Test filtering
    const filteredShipments = shipments.filter(shipment => shipment.id > 1);
    expect(filteredShipments.length).toBe(2);

    // Test mapping
    const ids = shipments.map(shipment => shipment.id);
    expect(ids).toEqual([1, 2, 3]);

    // Test finding
    const foundShipment = shipments.find(shipment => shipment.id === 2);
    expect(foundShipment?.id).toBe(2);
  });

  it('should handle JSON serialization', () => {
    const shipment: Shipment = {
      id: 1
    };

    const jsonString = JSON.stringify(shipment);
    const parsedShipment = JSON.parse(jsonString) as Shipment;

    expect(parsedShipment.id).toBe(shipment.id);
  });

  it('should handle large arrays', () => {
    const largeShipments: Shipment[] = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1 }));

    expect(largeShipments.length).toBe(1000);
    expect(largeShipments[0].id).toBe(1);
    expect(largeShipments[999].id).toBe(1000);
  });

  it('should handle sorting', () => {
    const shipments: Shipment[] = [
      { id: 3 },
      { id: 1 },
      { id: 2 }
    ];

    const sortedShipments = shipments.sort((a, b) => a.id - b.id);

    expect(sortedShipments[0].id).toBe(1);
    expect(sortedShipments[1].id).toBe(2);
    expect(sortedShipments[2].id).toBe(3);
  });

  it('should handle reverse sorting', () => {
    const shipments: Shipment[] = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    const reverseSortedShipments = shipments.sort((a, b) => b.id - a.id);

    expect(reverseSortedShipments[0].id).toBe(3);
    expect(reverseSortedShipments[1].id).toBe(2);
    expect(reverseSortedShipments[2].id).toBe(1);
  });

  it('should handle duplicate IDs', () => {
    const shipments: Shipment[] = [
      { id: 1 },
      { id: 1 },
      { id: 2 }
    ];

    expect(shipments[0].id).toBe(1);
    expect(shipments[1].id).toBe(1);
    expect(shipments[2].id).toBe(2);
  });

  it('should handle unique ID filtering', () => {
    const shipments: Shipment[] = [
      { id: 1 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 2 }
    ];

    const uniqueIds = [...new Set(shipments.map(s => s.id))];
    expect(uniqueIds).toEqual([1, 2, 3]);
  });

  it('should handle object comparison', () => {
    const shipment1: Shipment = { id: 1 };
    const shipment2: Shipment = { id: 1 };
    const shipment3: Shipment = { id: 2 };

    // Objects with same ID should be considered equal for ID comparison
    expect(shipment1.id).toBe(shipment2.id);
    expect(shipment1.id).not.toBe(shipment3.id);
  });

  it('should handle type safety', () => {
    // This test ensures TypeScript compilation works correctly
    const shipment: Shipment = {
      id: 1
    };

    // Should not allow additional properties
    // const invalidShipment: Shipment = {
    //   id: 1,
    //   name: 'test' // This would cause a TypeScript error
    // };

    expect(shipment).toBeDefined();
  });

  it('should handle edge case IDs', () => {
    const edgeCaseShipments: Shipment[] = [
      { id: Number.MAX_SAFE_INTEGER },
      { id: Number.MIN_SAFE_INTEGER },
      { id: 0 },
      { id: -1 }
    ];

    expect(edgeCaseShipments[0].id).toBe(Number.MAX_SAFE_INTEGER);
    expect(edgeCaseShipments[1].id).toBe(Number.MIN_SAFE_INTEGER);
    expect(edgeCaseShipments[2].id).toBe(0);
    expect(edgeCaseShipments[3].id).toBe(-1);
  });
});
