"use client";
import { useState } from 'react';
import styles from './LenguageToggle.module.css'; // Asumiendo que los estilos de botón están aquí
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageToggle() {
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');

  // const toggleLanguage = () => {
  //   setLanguage(prev => (prev === 'ES' ? 'EN' : 'ES'));
  //   // En una app real, aquí llamarías a una función de tu librería de i18n
  // };
const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // idioma actual (ej: "es" o "en")

  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "en" : "es";

    // 👇 Redirige a la misma ruta pero en el nuevo idioma
    const newPath = `/${newLocale}${pathname.startsWith('/') ? '' : '/'}${pathname.replace(/^\/(es|en)/, '')}`;
    router.push(newPath);
  };
  return (
    <button onClick={toggleLanguage} className={styles.language_toggle} aria-label={`Cambiar idioma a ${language === 'ES' ? 'Inglés' : 'Español'}`}>
      {language}
    </button>
  );
}