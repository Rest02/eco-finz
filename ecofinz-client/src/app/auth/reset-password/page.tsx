import { Suspense } from 'react';
import AuthCard from '@/features/auth/components/AuthCard';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Restablecer Contraseña"
      subtitle="Ingresa tu nueva contraseña para acceder a tu cuenta."
    >
      <Suspense fallback={<div>Cargando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
