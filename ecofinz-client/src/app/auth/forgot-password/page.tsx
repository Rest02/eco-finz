import AuthLayout from '@/features/auth/components/layout/AuthLayout';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Ingresa tu correo y te enviaremos las instrucciones."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
