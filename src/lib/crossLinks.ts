/** Cross-link relationships for "You might also love" sections — based on shared colors */
export const bouquetCrossLinks: Record<string, string[]> = {
  // 🔵 Blue group
  'bq-round-10':  ['bq-round-38', 'bq-zodiac-pisces', 'bq-zodiac-cancer'],   // Blue Sky
  'bq-round-38':  ['bq-round-10', 'bq-zodiac-pisces', 'bq-zodiac-cancer'],   // White Ocean
  'bq-zodiac-pisces':  ['bq-round-10', 'bq-round-38', 'bq-zodiac-cancer'],   // Pisces
  'bq-zodiac-cancer':  ['bq-round-10', 'bq-round-38', 'bq-zodiac-pisces'],   // Cancer

  // ⚫ Black group
  'bq-round-11':  ['bq-round-30', 'bq-round-31', 'bq-round-36'],   // Deep Night
  'bq-round-30':  ['bq-round-11', 'bq-round-31', 'bq-zodiac-taurus'],   // Night & Day
  'bq-round-31':  ['bq-round-11', 'bq-round-30', 'bq-round-42'],   // Elegant Contrast
  'bq-round-36':  ['bq-round-11', 'bq-round-30', 'bq-zodiac-taurus'],   // Imperial Bee
  'bq-zodiac-taurus': ['bq-round-11', 'bq-round-30', 'bq-round-36'],   // Taurus
  'bq-round-42':  ['bq-round-11', 'bq-round-31', 'bq-round-30'],   // Dark Pink Elegance

  // 🟢 Green group
  'bq-round-22':  ['bq-zodiac-aries', 'bq-round-10', 'bq-round-11'],   // Green Fresh
  'bq-zodiac-aries': ['bq-round-22', 'bq-zodiac-leo', 'bq-zodiac-sagittarius'],   // Aries

  // 🔴 Red group
  'bq-round-5':   ['bq-round-37', 'bq-round-40', 'bq-round-45'],   // Total Passion
  'bq-round-37':  ['bq-round-5', 'bq-round-45', 'bq-round-27'],    // Bicolor Passion
  'bq-round-45':  ['bq-round-5', 'bq-round-37', 'bq-round-40'],    // Elegant Passion
  'bq-round-40':  ['bq-round-5', 'bq-round-26', 'bq-round-25'],    // Dark Romance
  'bq-round-28':  ['bq-round-5', 'bq-round-27', 'bq-round-26'],    // Sunflowers & Passion
  'bq-round-25':  ['bq-round-5', 'bq-round-40', 'bq-round-47'],    // Intense Romance
  'bq-round-26':  ['bq-round-5', 'bq-round-40', 'bq-round-28'],    // Fire & Sun
  'bq-round-46':  ['bq-round-5', 'bq-round-18', 'bq-round-47'],    // Tricolor Love
  'bq-round-47':  ['bq-round-46', 'bq-round-25', 'bq-round-18'],   // Pink Symphony
  'bq-zodiac-sagittarius': ['bq-round-5', 'bq-zodiac-capricorn', 'bq-zodiac-aquarius'],
  'bq-zodiac-capricorn':   ['bq-round-5', 'bq-zodiac-sagittarius', 'bq-zodiac-aquarius'],
  'bq-zodiac-aquarius':    ['bq-round-5', 'bq-zodiac-sagittarius', 'bq-zodiac-capricorn'],

  // ⚪ White group
  'bq-round-6':   ['bq-round-44', 'bq-round-15', 'bq-round-13'],   // Pure White
  'bq-round-44':  ['bq-round-6', 'bq-round-39', 'bq-round-34'],    // Infinite Tenderness
  'bq-round-15':  ['bq-round-6', 'bq-round-20', 'bq-round-39'],    // Spring Garden
  'bq-round-35':  ['bq-round-19', 'bq-round-33', 'bq-round-24'],   // Orange Citrus
  'bq-round-13':  ['bq-round-6', 'bq-round-7', 'bq-round-39'],     // Pink & White Dawn
  'bq-round-39':  ['bq-round-15', 'bq-round-44', 'bq-round-13'],   // Soft Spring
  'bq-round-23':  ['bq-round-12', 'bq-round-47', 'bq-round-31'],   // Magic Pastel
  'bq-round-24':  ['bq-round-19', 'bq-round-35', 'bq-round-12'],   // Warm Sunset

  // 🌸 Hot Pink group
  'bq-round-7':   ['bq-round-13', 'bq-round-40', 'bq-round-34'],   // Hot Pink Blush
  'bq-round-34':  ['bq-round-7', 'bq-round-44', 'bq-round-18'],    // Red Sweetness
  'bq-zodiac-libra': ['bq-round-7', 'bq-round-13', 'bq-zodiac-scorpio'],   // Libra

  // Classic Tricolor
  'bq-round-18':  ['bq-round-34', 'bq-round-46', 'bq-round-47'],   // Classic Tricolor

  // 💗 Pink group
  'bq-zodiac-scorpio': ['bq-zodiac-libra', 'bq-round-47', 'bq-round-23'],   // Scorpio

  // 🟣 Purple group
  'bq-round-12':  ['bq-round-25', 'bq-round-23', 'bq-zodiac-virgo'],   // Purple Charm
  'bq-zodiac-virgo': ['bq-round-12', 'bq-round-23', 'bq-round-24'],    // Virgo

  // 🟡 Yellow group
  'bq-round-20':  ['bq-round-15', 'bq-round-27', 'bq-round-28'],   // Radiant Sun
  'bq-round-27':  ['bq-round-20', 'bq-round-28', 'bq-round-5'],    // Iberian Passion
  'bq-round-33':  ['bq-round-35', 'bq-round-32', 'bq-round-20'],   // Light Citrus
  'bq-zodiac-leo': ['bq-round-20', 'bq-round-15', 'bq-round-36'],  // Leo

  // 🟠 Orange group
  'bq-round-19':  ['bq-round-35', 'bq-round-24', 'bq-round-33'],   // Orange Sunset
  'bq-round-32':  ['bq-round-35', 'bq-round-33', 'bq-round-19'],   // Citrus Refresh
  'bq-zodiac-gemini': ['bq-round-19', 'bq-round-35', 'bq-round-33'],   // Gemini

  'bq-round-43':  ['bq-round-5', 'bq-round-40', 'bq-round-25'],    // Passionate Love

  // Soft Pink  
  'bq-round-8':   ['bq-round-44', 'bq-round-13', 'bq-round-23'],   // Soft Pink
};

export const roomDecorCrossLinks: Record<string, string[]> = {
  'love-bomb':     ['overly-romantic', 'deluxe-love-package'],
  'overly-romantic': ['love-bomb', 'deluxe-love-package'],
  'deluxe-love-package':   ['overly-romantic', 'love-bomb'],
};
