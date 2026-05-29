import { Transaction } from "../types/finance";

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
