'use client';

import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm'; // Componente que crearemos a continuación

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
