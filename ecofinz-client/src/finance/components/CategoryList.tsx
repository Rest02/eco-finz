'use client';

import React from 'react';
import { Category } from '../dto/finance';

interface Props {
  categories: Category[];
  onCategoryDeleted: (categoryId: string) => void;
}

const CategoryList: React.FC<Props> = ({ categories, onCategoryDeleted }) => {
  if (categories.length === 0) {
    return <p>No hay categorías definidas.</p>;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Mis Categorías</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((category) => (
          <li key={category.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{category.name}</div>
              <div style={{ fontSize: '0.9em', color: '#555' }}>Tipo: {category.type}</div>
            </div>
            <button 
              onClick={() => onCategoryDeleted(category.id)}
              style={{ padding: '8px 12px', border: 'none', backgroundColor: '#e53e3e', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
