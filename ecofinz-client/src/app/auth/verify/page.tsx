import AuthCard from '@/features/auth/components/AuthCard';
import VerifyForm from '@/features/auth/components/VerifyForm';

export default function VerifyPage() {
  return (
    <AuthCard
      title="Verifica tu Cuenta"
      subtitle="Hemos enviado un PIN a tu correo electrónico."
    >
      <VerifyForm />
    </AuthCard>
  );
}
