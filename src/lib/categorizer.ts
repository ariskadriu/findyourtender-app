/**
 * Utility to map FPP (CPV) codes to FYT Categories.
 * Kosovo portal uses FPP codes where the first 2 digits usually represent the industry.
 */

const CATEGORY_MAP: Record<string, string> = {
  '45': 'Ndërtim',
  '71': 'Ndërtim', // Architecture/Engineering
  '72': 'IT dhe Teknologji',
  '30': 'IT dhe Teknologji', // Office machinery/Computers
  '33': 'Shëndetësi',
  '85': 'Shëndetësi', // Health/Social work
  '80': 'Arsim',
  '60': 'Transport',
  '63': 'Transport', // Logistics
  '09': 'Energji',
  '65': 'Energji', // Utilities
  '03': 'Bujqësi',
  '77': 'Bujqësi', // Agricultural services
  '79': 'Shërbime Konsulence', // Business/Legal/Consultancy
  '44': 'Furnizime', // Construction materials/supplies
  '39': 'Furnizime', // Furniture
};

export function mapFppToCategory(fppCode: string): string {
  if (!fppCode) return 'Tjetër';
  
  // Strip any non-numeric characters if necessary
  const cleanCode = fppCode.replace(/\D/g, '');
  const prefix = cleanCode.substring(0, 2);
  
  return CATEGORY_MAP[prefix] || 'Tjetër';
}
