'use client';

import React, { useState } from 'react';
import { CreateCategoryDto, TransactionType } from '@/finance/dto/finance';
import { Category } from '@/finance/dto/finance';

const categoryTypes: TransactionType[] = ["INGRESO", "EGRESO"];

interface Props {
  onCategoryCreated: (newCategory: Category) => void;
  // Pasamos la función del servicio para mantener el componente agnóstico
  createCategoryFn: (data: CreateCategoryDto) => Promise<{ data: Category }>;
}

const CategoryForm: React.FC<Props> = ({ onCategoryCreated, createCategoryFn }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EGRESO');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const newCategory: CreateCategoryDto = { name, type };

    try {
      const response = await createCategoryFn(newCategory);
      onCategoryCreated(response.data);
      // Reset form
      setName('');
      setType('EGRESO');
    } catch (err) {
      console.error('Failed to create category:', err);
      setError('No se pudo crear la categoría. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>Crear Nueva Categoría</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="category-name" style={{ display: 'block', marginBottom: '5px' }}>Nombre</label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div>
        <label htmlFor="category-type" style={{ display: 'block', marginBottom: '5px' }}>Tipo</label>
        <select
          id="category-type"
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          style={{ width: '100%', padding: '8px' }}
        >
          {categoryTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', border: 'none', backgroundColor: '#0070f3', color: 'white', borderRadius: '5px', cursor: 'pointer', opacity: isSubmitting ? 0.6 : 1 }}>
        {isSubmitting ? 'Creando...' : 'Crear Categoría'}
      </button>
    </form>
  );
};

export default CategoryForm;
