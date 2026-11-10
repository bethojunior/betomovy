class CurrencyFormat {
  static parsePriceToNumber(value) {
    if (value === null || value === undefined) {
      return NaN
    }
    if (typeof value === 'number') {
      return value
    }
    let s = String(value).trim().replace(/R\$\s*/gi, '').replace(/\$\s*/g, '').trim()
    if (!s) {
      return NaN
    }
    const hasComma = s.includes(',')
    const hasDot = s.includes('.')
    if (hasComma && hasDot) {
      const lastComma = s.lastIndexOf(',')
      const lastDot = s.lastIndexOf('.')
      if (lastComma > lastDot) {
        return parseFloat(s.replace(/\./g, '').replace(',', '.'))
      }
      return parseFloat(s.replace(/,/g, ''))
    }
    if (hasComma && !hasDot) {
      return parseFloat(s.replace(/\./g, '').replace(',', '.'))
    }
    return parseFloat(s)
  }

  static formatUSD(value) {
    const n = CurrencyFormat.parsePriceToNumber(value)
    if (Number.isNaN(n)) {
      return String(value ?? '')
    }
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  static formatBRL(value) {
    // MOVY Global USD requirement: format as USD $
    return CurrencyFormat.formatUSD(value)
  }

  static format(value) {
    return CurrencyFormat.formatUSD(value)
  }
}
