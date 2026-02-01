import AuthLayout from '@/features/auth/components/layout/AuthLayout';
import RegisterForm from '@/features/auth/components/RegisterForm';
import SocialAuth from '@/features/auth/components/SocialAuth';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu Cuenta"
      subtitle="Únete a EcoFinz y comienza a transformar tu salud financiera."
    >
      <RegisterForm />
      <SocialAuth />
    </AuthLayout>
  );
}
