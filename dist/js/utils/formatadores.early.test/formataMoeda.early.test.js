import { formataMoeda } from "../formatadores";

// Import the function to be tested
describe("formataMoeda() formataMoeda method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    test("should format a positive integer as BRL currency", () => {
      const valor = 1000;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("R$ 1.000,00");
    });

    test("should format a positive float as BRL currency", () => {
      const valor = 1234.56;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("R$ 1.234,56");
    });

    test("should format zero as BRL currency", () => {
      const valor = 0;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("R$ 0,00");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    test("should format a negative integer as BRL currency", () => {
      const valor = -1000;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("-R$ 1.000,00");
    });

    test("should format a negative float as BRL currency", () => {
      const valor = -1234.56;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("-R$ 1.234,56");
    });

    test("should handle very large numbers", () => {
      const valor = 1234567890.12;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("R$ 1.234.567.890,12");
    });

    test("should handle very small numbers", () => {
      const valor = 0.01;
      const formatted = formataMoeda(valor);
      expect(formatted).toBe("R$ 0,01");
    });

    test("should throw an error when input is not a number", () => {
      const valor = "not a number";
      expect(() => formataMoeda(valor)).toThrow(TypeError);
    });

    test("should throw an error when input is undefined", () => {
      const valor = undefined;
      expect(() => formataMoeda(valor)).toThrow(TypeError);
    });

    test("should throw an error when input is null", () => {
      const valor = null;
      expect(() => formataMoeda(valor)).toThrow(TypeError);
    });
  });
});
