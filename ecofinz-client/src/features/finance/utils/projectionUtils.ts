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
 * Returns the month offset relative to the current month.
 * A negative value means the start date is in the past but its installments
 * may still extend into the visible window. The caller is responsible for
 * range-checking via startMonth + installments - 1.
 */
export function getRelativeMonthIndex(
  startMonth: number, // 1-12
  startYear: number,  // YYYY
  monthsList: string[]
): number {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  return (startYear - currentYear) * 12 + (startMonth - 1 - currentMonthIndex);
}
