import { Account } from "../types/finance";
import { Card } from "../components/projection/types";

/**
 * Maps a real backend Account to the frontend Card format used in the projection matrix.
 */
export function accountToCard(account: Account): Card {
  const isCredit = account.type === "TARJETA_CREDITO";
  
  // Use credit limit for credit cards, or balance as fallback
  const limitValue = isCredit 
    ? (account.creditLimit ? Number(account.creditLimit) : 0)
    : Number(account.balance);

  // Fallback beautiful gradients if color is missing
  const fallbackColor = isCredit
    ? "from-emerald-500 to-teal-800"
    : "from-blue-600 to-indigo-900";

  return {
    id: account.id,
    name: account.name,
    limit: limitValue,
    color: account.color || fallbackColor,
    lastDigits: account.lastDigits || "0000",
    type: isCredit ? "credit" : "debit",
  };
}

/**
 * Generates an array of the next N months starting from the current month.
 * Formatted in Spanish (e.g., "Mayo 2026", "Junio 2026").
 */
export function getDynamicMonths(count = 6): string[] {
  const months: string[] = [];
  const currentDate = new Date();

  for (let i = 0; i < count; i++) {
    const tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    
    // Format month in Spanish
    const monthName = tempDate.toLocaleString("es-ES", { month: "long" });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const year = tempDate.getFullYear();

    months.push(`${capitalizedMonth} ${year}`);
  }

  return months;
}

/**
 * Calculates the relative month index (0 to N-1) for a projection based on its start month and year.
 * Returns -1 if the projection starts before the current month or after the dynamic months window.
 */
export function getRelativeMonthIndex(
  startMonth: number, // 1-12
  startYear: number,  // YYYY
  monthsList: string[]
): number {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  // Difference in months
  const diffMonths = (startYear - currentYear) * 12 + (startMonth - 1 - currentMonthIndex);

  if (diffMonths >= 0 && diffMonths < monthsList.length) {
    return diffMonths;
  }
  
  return -1;
}
