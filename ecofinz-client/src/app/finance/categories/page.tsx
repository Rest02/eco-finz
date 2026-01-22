'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { Category } from '@/features/finance/types/finance';
import { createCategory, updateCategory } from '@/features/finance/services/financeService';
import { useCategories, useDeleteCategory } from '@/features/finance/hooks/useCategories';
import Link from 'next/link';
import CategoryList from '@/features/finance/components/CategoryList';
import CategoryForm from '@/features/finance/components/CategoryForm';

export default function CategoriesPage() {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // React Query Hooks
  const { data: categories = [], isLoading, error: fetchError } = useCategories();
  const deleteCategoryMutation = useDeleteCategory();

  const handleCategoryCreated = (newCategory: Category) => {
    setDeleteError(null);
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setEditingCategory(null);
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryDeleted = async (categoryId: string) => {
    try {
      setDeleteError(null);
      await deleteCategoryMutation.mutateAsync(categoryId);
      if (editingCategory?.id === categoryId) {
        setEditingCategory(null);
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 500) {
          setDeleteError(
            '❌ No se puede eliminar esta categoría porque está siendo utilizada en transacciones o presupuestos existentes.'
          );
        } else {
          setDeleteError('❌ Error al eliminar la categoría. Por favor, intenta de nuevo.');
        }
      } else {
        setDeleteError('❌ Error inesperado al eliminar la categoría.');
      }
      setTimeout(() => setDeleteError(null), 10000);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando categorías...</div>;
  }

  if (fetchError) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Error al cargar las categorías.</div>;
  }

  return (
    <div>
      <h1>Gestión de Categorías</h1>
      <p>Aquí puedes crear, ver y eliminar tus categorías de ingresos y egresos.</p>

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
