'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
