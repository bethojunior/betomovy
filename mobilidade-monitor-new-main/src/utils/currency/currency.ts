const CurrencyUtils = {
  parseNumber(value: unknown) {
    if (value == null || value == "" ) return 0;

    if (typeof value === "string") {
      let normalized = value.replace(/[^\d.,]/g, '');

      normalized = normalized.replace(/\./g, "").replace(",", ".");
      const parsed = parseFloat(normalized);
      return isNaN(parsed) ? 0 : parsed;
    }
    if (typeof value === "number") return value;
    return 0;
  },

  parseMonetaryValue(value: unknown): number {
    if (value == null || value === "") return 0;
    
    if (typeof value === "number") return value;
    
    if (typeof value === "string") {
      // Detecta formato brasileiro (ex: "1.234,56" ou "1234,56")
      // Quando há vírgula e ela aparece depois do último ponto
      if (value.includes(',') && value.lastIndexOf(',') > value.lastIndexOf('.')) {
        return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
      }

      // Detecta formato com separador de milhar (ex: "1.234" ou "1.234.567")
      // Quando há ponto mas não vírgula, e o ponto é separador de milhar
      if (value.includes('.') && !value.includes(',')) {
        const parts = value.split('.');
        // Se tem mais de 2 partes ou a parte decimal tem 3 dígitos, é separador de milhar
        if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
          return parseFloat(value.replace(/\./g, '')) || 0;
        }
      }
      
      // Formato americano ou número simples (ex: "1234.56" ou "1234")
      return parseFloat(value.replace(/,/g, '')) || 0;
    }
    
    return 0;
  },

  formatCurrency(value: unknown) {
    const numberValue = this.parseMonetaryValue(value);
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },
};

export default CurrencyUtils;
