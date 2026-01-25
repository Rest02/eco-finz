'use client';

import React from 'react';

interface SummaryTotalsProps {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
}

const SummaryTotals: React.FC<SummaryTotalsProps> = ({
    totalIncome,
    totalExpenses,
    balance,
}) => {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div className="summary-totals">
            <div className="total-card income-card">
                <div className="card-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 5v14M5 12l7-7 7 7" />
                    </svg>
                </div>
                <div className="card-content">
                    <p className="card-label">Total Ingresos</p>
                    <p className="card-amount income-amount">{formatCurrency(totalIncome)}</p>
                </div>
            </div>

            <div className="total-card expense-card">
                <div className="card-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 19V5M5 12l7 7 7-7" />
                    </svg>
                </div>
                <div className="card-content">
                    <p className="card-label">Total Egresos</p>
                    <p className="card-amount expense-amount">{formatCurrency(totalExpenses)}</p>
                </div>
            </div>

            <div className={`total-card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
                <div className="card-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                </div>
                <div className="card-content">
                    <p className="card-label">Balance</p>
                    <p className={`card-amount ${balance >= 0 ? 'positive-amount' : 'negative-amount'}`}>
                        {formatCurrency(balance)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SummaryTotals;
