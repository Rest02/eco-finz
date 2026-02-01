import AuthLayout from '@/features/auth/components/layout/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';
import SocialAuth from '@/features/auth/components/SocialAuth';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresa tus datos para acceder a tu panel."
    >
      <LoginForm />
      <SocialAuth />
    </AuthLayout>
  );
}
