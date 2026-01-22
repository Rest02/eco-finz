import React, { useState, useEffect } from 'react';
import { CreateCategoryDto, UpdateCategoryDto, TransactionType, Category } from '@/finance/dto/finance';

const categoryTypes: TransactionType[] = ["INGRESO", "EGRESO"];

interface Props {
  onCategoryCreated: (newCategory: Category) => void;
  onCategoryUpdated?: (updatedCategory: Category) => void;
  initialData?: Category;
  isEditMode?: boolean;
  onCancel?: () => void;
  createCategoryFn: (data: CreateCategoryDto) => Promise<{ data: Category }>;
  updateCategoryFn?: (id: string, data: UpdateCategoryDto) => Promise<{ data: Category }>;
}

const CategoryForm: React.FC<Props> = ({
  onCategoryCreated,
  onCategoryUpdated,
  initialData,
  isEditMode = false,
  onCancel,
  createCategoryFn,
  updateCategoryFn
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('EGRESO');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setType(initialData.type);
    } else {
      setName('');
      setType('EGRESO');
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode && initialData && updateCategoryFn && onCategoryUpdated) {
        const updateData: UpdateCategoryDto = { name, type };
        const response = await updateCategoryFn(initialData.id, updateData);
        onCategoryUpdated(response.data);
      } else {
        const newCategory: CreateCategoryDto = { name, type };
        const response = await createCategoryFn(newCategory);
        onCategoryCreated(response.data);
        // Reset form only on create
        setName('');
        setType('EGRESO');
      }
    } catch (err) {
      console.error('Failed to save category:', err);
      setError(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} la categoría. Inténtalo de nuevo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
      <h2>{isEditMode ? 'Editar Categoría' : 'Crear Nueva Categoría'}</h2>
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
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 15px',
            border: 'none',
            backgroundColor: isSubmitting ? '#ccc' : '#0070f3',
            color: 'white',
            borderRadius: '5px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            flex: 1
          }}
        >
          {isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
        {isEditMode && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 15px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              color: '#333',
              borderRadius: '5px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
