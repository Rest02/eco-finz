'use client';

import React from 'react';
import { SummaryCategory } from '../types/finance';

interface CategorySummaryListProps {
    categorySummaries: SummaryCategory[];
}

const CategorySummaryList: React.FC<CategorySummaryListProps> = ({
    categorySummaries,
}) => {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getProgressPercentage = (spent: number, budgeted: number): number => {
        if (budgeted === 0) return 0;
        return Math.min((spent / budgeted) * 100, 100);
    };

    const getStatusClass = (remaining: number): string => {
        if (remaining > 0) return 'status-good';
        if (remaining === 0) return 'status-warning';
        return 'status-danger';
    };

    if (categorySummaries.length === 0) {
        return (
            <div className="category-summary-empty">
                <p>No hay categorías con presupuesto definido para este período.</p>
            </div>
        );
    }

    return (
        <div className="category-summary-list">
            <h3 className="category-summary-title">Presupuesto por Categoría</h3>
            <div className="category-summary-grid">
                {categorySummaries.map((category) => {
                    const progressPercentage = getProgressPercentage(
                        category.spent,
                        category.budgeted
                    );
                    const statusClass = getStatusClass(category.remaining);

                    return (
                        <div key={category.categoryId} className={`category-summary-card ${statusClass}`}>
                            <div className="category-header">
                                <h4 className="category-name">{category.categoryName}</h4>
                                <span className={`category-status ${statusClass}`}>
                                    {category.remaining >= 0 ? '✓' : '!'}
                                </span>
                            </div>

                            <div className="category-amounts">
                                <div className="amount-row">
                                    <span className="amount-label">Presupuestado:</span>
                                    <span className="amount-value">{formatCurrency(category.budgeted)}</span>
                                </div>
                                <div className="amount-row">
                                    <span className="amount-label">Gastado:</span>
                                    <span className="amount-value spent">{formatCurrency(category.spent)}</span>
                                </div>
                                <div className="amount-row">
                                    <span className="amount-label">Restante:</span>
                                    <span className={`amount-value ${category.remaining >= 0 ? 'positive' : 'negative'}`}>
                                        {formatCurrency(category.remaining)}
                                    </span>
                                </div>
                            </div>

                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div
                                        className={`progress-fill ${statusClass}`}
                                        style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {progressPercentage.toFixed(1)}% utilizado
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySummaryList;
