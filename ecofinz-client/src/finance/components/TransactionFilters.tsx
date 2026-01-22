'use client';

import React, { useState, useEffect } from 'react';
import { Category, TransactionType } from '../dto/finance';
import { getCategories } from '../services/financeService';

interface FilterValues {
    type?: TransactionType | '';
    categoryId?: string;
    startDate?: string;
    endDate?: string;
}

interface Props {
    onFilterChange: (filters: FilterValues) => void;
}

const TransactionFilters: React.FC<Props> = ({ onFilterChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<FilterValues>({
        type: '',
        categoryId: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to fetch categories for filters:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        onFilterChange({ ...filters });
    };

    const handleReset = () => {
        const resetFilters: FilterValues = {
            type: '',
            categoryId: '',
            startDate: '',
            endDate: '',
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div style={{
            fontFamily: 'sans-serif',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>🔍 Filtrar Transacciones</h3>

            <div style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                alignItems: 'flex-end'
            }}>
                <div style={{ flex: '1 1 150px' }}>
                    <label htmlFor="type" style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#64748b' }}>Tipo</label>
                    <select
                        id="type"
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="">Todos</option>
                        <option value="INGRESO">Ingresos</option>
                        <option value="EGRESO">Egresos</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 200px' }}>
                    <label htmlFor="categoryId" style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#64748b' }}>Categoría</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ flex: '1 1 150px' }}>
                    <label htmlFor="startDate" style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#64748b' }}>Desde</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ flex: '1 1 150px' }}>
                    <label htmlFor="endDate" style={{ display: 'block', fontSize: '13px', marginBottom: '5px', color: '#64748b' }}>Hasta</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleApplyFilters}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            height: '38px'
                        }}
                    >
                        Filtrar
                    </button>

                    <button
                        onClick={handleReset}
                        style={{
                            padding: '8px 15px',
                            backgroundColor: '#64748b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            height: '38px'
                        }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionFilters;
