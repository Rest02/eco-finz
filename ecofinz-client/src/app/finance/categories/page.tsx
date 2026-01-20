'use client';

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { Category } from '@/finance/dto/finance';
import { getCategories, createCategory, deleteCategory } from '@/finance/services/financeService';
import Link from 'next/link';
import CategoryList from '@/finance/components/CategoryList';
import CategoryForm from '@/finance/components/CategoryForm';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleCategoryDeleted = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      console.error('Failed to delete category:', err);
      // Opcional: mostrar un error al usuario
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
      
      <CategoryForm onCategoryCreated={handleCategoryCreated} createCategoryFn={createCategory} />
      
      <hr style={{ margin: '20px 0' }} />
      
      <CategoryList categories={categories} onCategoryDeleted={handleCategoryDeleted} />

      <div style={{ marginTop: '20px' }}>
        <Link href="/finance/dashboard">
          &larr; Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
