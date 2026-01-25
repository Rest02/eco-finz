'use client';

import React from 'react';
import { MonthlySummary as MonthlySummaryType } from '../types/finance';
import SummaryTotals from './SummaryTotals';
import CategorySummaryList from './CategorySummaryList';

interface MonthlySummaryProps {
  data: MonthlySummaryType | null;
  isLoading?: boolean;
  year: number;
  month: number;
  onDateChange: (year: number, month: number) => void;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  data,
  isLoading,
  year,
  month,
  onDateChange,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDateChange(parseInt(e.target.value), month);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDateChange(year, parseInt(e.target.value));
  };

  return (
    <div className="monthly-summary">
      <div className="summary-header">
        <h2 className="summary-title">Resumen Mensual</h2>
        <div className="date-selector">
          <div className="selector-group">
            <label htmlFor="month-select">Mes:</label>
            <select
              id="month-select"
              value={month}
              onChange={handleMonthChange}
              className="date-select"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="selector-group">
            <label htmlFor="year-select">Año:</label>
            <select
              id="year-select"
              value={year}
              onChange={handleYearChange}
              className="date-select"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="summary-loading">
          <div className="loading-spinner"></div>
          <p>Cargando resumen...</p>
        </div>
      ) : data ? (
        <div className="summary-content">
          <SummaryTotals
            totalIncome={data.totalIncome}
            totalExpenses={data.totalExpenses}
            balance={data.balance}
          />
          <CategorySummaryList categorySummaries={data.categorySummaries} />
        </div>
      ) : (
        <div className="summary-empty">
          <p>No hay datos disponibles para este período.</p>
        </div>
      )}
    </div>
  );
};

export default MonthlySummary;
