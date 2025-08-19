import { Calculation } from './calculation.model';

describe('Calculation Model', () => {
  it('should create a valid calculation object', () => {
    const calculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 1000,
      cost: 500,
      profitOrLoss: 500
    };

    expect(calculation.id).toBe(1);
    expect(calculation.shipmentId).toBe(1);
    expect(calculation.income).toBe(1000);
    expect(calculation.cost).toBe(500);
    expect(calculation.profitOrLoss).toBe(500);
  });

  it('should handle zero values', () => {
    const calculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 0,
      cost: 0,
      profitOrLoss: 0
    };

    expect(calculation.income).toBe(0);
    expect(calculation.cost).toBe(0);
    expect(calculation.profitOrLoss).toBe(0);
  });

  it('should handle negative profit/loss', () => {
    const calculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 500,
      cost: 1000,
      profitOrLoss: -500
    };

    expect(calculation.profitOrLoss).toBe(-500);
  });

  it('should handle large numbers', () => {
    const calculation: Calculation = {
      id: 999999,
      shipmentId: 999999,
      income: 999999.99,
      cost: 999999.99,
      profitOrLoss: 0
    };

    expect(calculation.id).toBe(999999);
    expect(calculation.shipmentId).toBe(999999);
    expect(calculation.income).toBe(999999.99);
    expect(calculation.cost).toBe(999999.99);
  });

  it('should handle decimal values', () => {
    const calculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 1000.50,
      cost: 500.25,
      profitOrLoss: 500.25
    };

    expect(calculation.income).toBe(1000.50);
    expect(calculation.cost).toBe(500.25);
    expect(calculation.profitOrLoss).toBe(500.25);
  });

  it('should maintain data integrity', () => {
    const originalCalculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 1000,
      cost: 500,
      profitOrLoss: 500
    };

    // Create a copy
    const copiedCalculation: Calculation = { ...originalCalculation };

    // Modify the copy
    copiedCalculation.income = 2000;
    copiedCalculation.profitOrLoss = 1500;

    // Original should remain unchanged
    expect(originalCalculation.income).toBe(1000);
    expect(originalCalculation.profitOrLoss).toBe(500);

    // Copy should have new values
    expect(copiedCalculation.income).toBe(2000);
    expect(copiedCalculation.profitOrLoss).toBe(1500);
  });

  it('should handle different shipment IDs', () => {
    const calculations: Calculation[] = [
      {
        id: 1,
        shipmentId: 1,
        income: 1000,
        cost: 500,
        profitOrLoss: 500
      },
      {
        id: 2,
        shipmentId: 2,
        income: 2000,
        cost: 1500,
        profitOrLoss: 500
      },
      {
        id: 3,
        shipmentId: 1,
        income: 3000,
        cost: 2500,
        profitOrLoss: 500
      }
    ];

    expect(calculations[0].shipmentId).toBe(1);
    expect(calculations[1].shipmentId).toBe(2);
    expect(calculations[2].shipmentId).toBe(1);
  });

  it('should handle profit scenarios', () => {
    const profitCalculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 1000,
      cost: 500,
      profitOrLoss: 500
    };

    expect(profitCalculation.profitOrLoss).toBeGreaterThan(0);
  });

  it('should handle loss scenarios', () => {
    const lossCalculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 500,
      cost: 1000,
      profitOrLoss: -500
    };

    expect(lossCalculation.profitOrLoss).toBeLessThan(0);
  });

  it('should handle break-even scenarios', () => {
    const breakEvenCalculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 1000,
      cost: 1000,
      profitOrLoss: 0
    };

    expect(breakEvenCalculation.profitOrLoss).toBe(0);
  });

  it('should handle array operations', () => {
    const calculations: Calculation[] = [
      {
        id: 1,
        shipmentId: 1,
        income: 1000,
        cost: 500,
        profitOrLoss: 500
      },
      {
        id: 2,
        shipmentId: 1,
        income: 2000,
        cost: 1500,
        profitOrLoss: 500
      }
    ];

    // Test array methods
    expect(calculations.length).toBe(2);
    expect(calculations[0].id).toBe(1);
    expect(calculations[1].id).toBe(2);

    // Test filtering
    const filteredCalculations = calculations.filter(calc => calc.profitOrLoss > 0);
    expect(filteredCalculations.length).toBe(2);

    // Test mapping
    const totalIncome = calculations.reduce((sum, calc) => sum + calc.income, 0);
    expect(totalIncome).toBe(3000);
  });

  it('should handle JSON serialization', () => {
    const calculation: Calculation = {
      id: 1,
      shipmentId: 1,
      income: 1000,
      cost: 500,
      profitOrLoss: 500
    };

    const jsonString = JSON.stringify(calculation);
    const parsedCalculation = JSON.parse(jsonString) as Calculation;

    expect(parsedCalculation.id).toBe(calculation.id);
    expect(parsedCalculation.shipmentId).toBe(calculation.shipmentId);
    expect(parsedCalculation.income).toBe(calculation.income);
    expect(parsedCalculation.cost).toBe(calculation.cost);
    expect(parsedCalculation.profitOrLoss).toBe(calculation.profitOrLoss);
  });

  it('should handle partial calculation objects', () => {
    const partialCalculation: Partial<Calculation> = {
      income: 1000,
      cost: 500
    };

    expect(partialCalculation.income).toBe(1000);
    expect(partialCalculation.cost).toBe(500);
    expect(partialCalculation.id).toBeUndefined();
    expect(partialCalculation.shipmentId).toBeUndefined();
    expect(partialCalculation.profitOrLoss).toBeUndefined();
  });
});
