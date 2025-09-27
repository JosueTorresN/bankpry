// components/auth/AuthLayout.tsx
import Image from 'next/image';
// Importa sus propios estilos
import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <main className={styles.container}>
      <section className={styles.brand_section}>
        <Image
          src="/logo.png"
          alt="Logo de BanCrap"
          width={150}
          height={150}
          className={styles.logo_image}
        />
        <h1 className={styles.app_title}>{title}</h1>
        <p className={styles.app_description}>{description}</p>
      </section>
      <section className={styles.form_section}>
        {children}
      </section>
    </main>
  );
}