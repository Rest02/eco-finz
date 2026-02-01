import { Suspense } from 'react';
import AuthLayout from '@/features/auth/components/layout/AuthLayout';
import VerifyForm from '@/features/auth/components/VerifyForm';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AuthLayout
        title="Verifica tu Cuenta"
        subtitle="Hemos enviado un PIN a tu correo electrónico."
      >
        <VerifyForm />
      </AuthLayout>
    </Suspense>
  );
}
