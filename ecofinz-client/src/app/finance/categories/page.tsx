'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { Category } from '@/features/finance/types/finance';
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/features/finance/services/financeService';
import Link from 'next/link';
import CategoryList from '@/features/finance/components/CategoryList';
import CategoryForm from '@/features/finance/components/CategoryForm';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        setCategories(response.data);
        setError(null);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 404) {
          setCategories([]);
          setError(null);
        } else {
          console.error('Failed to fetch categories:', err);
          setError('No se pudieron cargar las categorías.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryCreated = (newCategory: Category) => {
    setCategories(prev => [newCategory, ...prev]);
    setDeleteError(null); // Limpiar errores previos
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories(prev =>
      prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
    );
    setEditingCategory(null);
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryDeleted = async (categoryId: string) => {
    try {
      setDeleteError(null); // Limpiar errores previos
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      if (editingCategory?.id === categoryId) {
        setEditingCategory(null);
      }
    } catch (err) {
      console.error('Failed to delete category:', err);

      // Manejo específico de errores
      if (err instanceof AxiosError) {
        if (err.response?.status === 500) {
          setDeleteError(
            '❌ No se puede eliminar esta categoría porque está siendo utilizada en transacciones o presupuestos existentes. ' +
            'Primero debes eliminar o reasignar las transacciones/presupuestos asociados.'
          );
        } else if (err.response?.status === 404) {
          setDeleteError('❌ La categoría no existe o ya fue eliminada.');
        } else if (err.response?.status === 403) {
          setDeleteError('❌ No tienes permisos para eliminar esta categoría.');
        } else {
          setDeleteError('❌ Error al eliminar la categoría. Por favor, intenta de nuevo.');
        }
      } else {
        setDeleteError('❌ Error inesperado al eliminar la categoría.');
      }

      // Auto-ocultar el mensaje después de 10 segundos
      setTimeout(() => setDeleteError(null), 10000);
    }
  };

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Gestión de Categorías</h1>
      <p>Aquí puedes crear, ver y eliminar tus categorías de ingresos y egresos.</p>

      {/* Mensaje de error al eliminar */}
      {deleteError && (
        <div style={{
          backgroundColor: '#fee',
          border: '2px solid #c33',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#c33',
          fontWeight: '500'
        }}>
          {deleteError}
        </div>
      )}

      <CategoryForm
        onCategoryCreated={handleCategoryCreated}
        onCategoryUpdated={handleCategoryUpdated}
        initialData={editingCategory || undefined}
        isEditMode={!!editingCategory}
        onCancel={() => setEditingCategory(null)}
        createCategoryFn={createCategory}
        updateCategoryFn={updateCategory}
      />

      <hr style={{ margin: '20px 0' }} />

      <CategoryList
        categories={categories}
        onCategoryDeleted={handleCategoryDeleted}
        onCategoryEdit={handleCategoryEdit}
      />

      <div style={{ marginTop: '20px' }}>
        <Link href="/finance/dashboard">
          &larr; Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
