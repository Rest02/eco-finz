import { Transaction, Projection } from "../types/finance";

export interface BillingPeriod {
  start: Date;
  end: Date;
}

export function getBillingPeriod(closingDay: number): BillingPeriod {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let endMonth: number;
  let endYear: number;

  if (currentDay > closingDay) {
    endMonth = currentMonth;
    endYear = currentYear;
  } else {
    endMonth = currentMonth - 1;
    endYear = currentYear;
    if (endMonth < 0) {
      endMonth = 11;
      endYear = currentYear - 1;
    }
  }

  const periodEnd = new Date(endYear, endMonth, closingDay, 23, 59, 59, 999);

  let startMonth = endMonth - 1;
  let startYear = endYear;
  if (startMonth < 0) {
    startMonth = 11;
    startYear = endYear - 1;
  }
  const periodStart = new Date(startYear, startMonth, closingDay + 1);

  return { start: periodStart, end: periodEnd };
}

export function getNextBillingPeriod(closingDay: number): BillingPeriod {
  const { end: currentEnd } = getBillingPeriod(closingDay);

  let startMonth = currentEnd.getMonth() + 1;
  let startYear = currentEnd.getFullYear();
  if (startMonth > 11) {
    startMonth = 0;
    startYear += 1;
  }
  const nextStart = new Date(startYear, startMonth, closingDay + 1);

  let endMonth = startMonth + 1;
  let endYear = startYear;
  if (endMonth > 11) {
    endMonth = 0;
    endYear += 1;
  }
  const nextEnd = new Date(endYear, endMonth, closingDay, 23, 59, 59, 999);

  return { start: nextStart, end: nextEnd };
}

export function getInstallmentMonth(projection: Projection, index: number): { month: number; year: number } {
  let month = projection.startMonth + index;
  let year = projection.startYear;
  while (month > 12) {
    month -= 12;
    year += 1;
  }
  return { month, year };
}

function findProjection(
  projections: Projection[],
  accountId: string,
  tx: Transaction
): Projection | undefined {
  const cuotasMatch = tx.description.match(/ \| cuotas: (\d+)$/);
  if (!cuotasMatch) return undefined;

  const numCuotas = parseInt(cuotasMatch[1]);
  const cleanDesc = tx.description.replace(/ \| cuotas: \d+$/, '');

  return projections.find(p =>
    p.accountId === accountId &&
    p.description === cleanDesc &&
    Math.abs(Number(p.amount) - Number(tx.amount)) < 0.01 &&
    p.installments === numCuotas
  );
}

export function getBilledAmountWithProjections(
  transactions: Transaction[],
  projections: Projection[],
  closingDay: number,
  accountId: string
): number {
  const { start, end } = getBillingPeriod(closingDay);
  const statementMonth = end.getMonth() + 1;
  const statementYear = end.getFullYear();

  let total = 0;

  for (const tx of transactions) {
    if (tx.type !== "EGRESO") continue;

    const projection = findProjection(projections, accountId, tx);

    if (projection) {
      const quotaAmount = Number(projection.amount) / projection.installments;
      for (let i = 0; i < projection.installments; i++) {
        const { month, year } = getInstallmentMonth(projection, i);
        if (month === statementMonth && year === statementYear) {
          total += quotaAmount;
          break;
        }
      }
    } else {
      const txDate = new Date(tx.date);
      if (txDate >= start && txDate <= end) {
        total += Number(tx.amount);
      }
    }
  }

  return total;
}

export function getUnbilledAmountWithProjections(
  transactions: Transaction[],
  projections: Projection[],
  closingDay: number,
  accountId: string
): number {
  const { end: currentEnd } = getBillingPeriod(closingDay);
  const nextPeriod = getNextBillingPeriod(closingDay);
  const nextStatementMonth = nextPeriod.end.getMonth() + 1;
  const nextStatementYear = nextPeriod.end.getFullYear();

  let total = 0;

  for (const tx of transactions) {
    if (tx.type !== "EGRESO") continue;

    const projection = findProjection(projections, accountId, tx);

    if (projection) {
      const quotaAmount = Number(projection.amount) / projection.installments;
      for (let i = 0; i < projection.installments; i++) {
        const { month, year } = getInstallmentMonth(projection, i);
        if (month === nextStatementMonth && year === nextStatementYear) {
          total += quotaAmount;
          break;
        }
      }
    } else {
      const txDate = new Date(tx.date);
      if (txDate > currentEnd) {
        total += Number(tx.amount);
      }
    }
  }

  return total;
}

export function getBilledAmount(
  transactions: Transaction[],
  closingDay: number
): number {
  const { start, end } = getBillingPeriod(closingDay);
  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return tx.type === "EGRESO" && txDate >= start && txDate <= end;
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
}

export function getUnbilledAmount(
  transactions: Transaction[],
  closingDay: number
): number {
  const { end } = getBillingPeriod(closingDay);
  return transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return tx.type === "EGRESO" && txDate > end;
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
}

/**
 * Returns the billing period whose due date falls in the target month/year.
 * Assumes the due date is after the closing day (typical flow: closing in month M-1, due in month M).
 */
export function getBillingPeriodForMonth(
  closingDay: number,
  targetMonth: number,
  targetYear: number
): BillingPeriod {
  // The statement that is due in (targetMonth, targetYear) closed in the prior month
  let closeMonth = targetMonth - 1;
  let closeYear = targetYear;
  if (closeMonth < 1) {
    closeMonth = 12;
    closeYear = targetYear - 1;
  }

  const periodEnd = new Date(closeYear, closeMonth - 1, closingDay, 23, 59, 59, 999);

  let startMonth = closeMonth - 1;
  let startYear = closeYear;
  if (startMonth < 1) {
    startMonth = 12;
    startYear = closeYear - 1;
  }
  const periodStart = new Date(startYear, startMonth - 1, closingDay + 1);

  return { start: periodStart, end: periodEnd };
}

/**
 * Calculates billed amount for a specific billing period, including installments.
 */
export function getBilledAmountForPeriod(
  transactions: Transaction[],
  projections: Projection[],
  accountId: string,
  period: BillingPeriod
): number {
  const statementMonth = period.end.getMonth() + 1;
  const statementYear = period.end.getFullYear();

  let total = 0;

  for (const tx of transactions) {
    if (tx.type !== "EGRESO") continue;

    const projection = findProjection(projections, accountId, tx);

    if (projection) {
      const quotaAmount = Number(projection.amount) / projection.installments;
      for (let i = 0; i < projection.installments; i++) {
        const { month, year } = getInstallmentMonth(projection, i);
        if (month === statementMonth && year === statementYear) {
          total += quotaAmount;
          break;
        }
      }
    } else {
      const txDate = new Date(tx.date);
      if (txDate >= period.start && txDate <= period.end) {
        total += Number(tx.amount);
      }
    }
  }

  return total;
}
