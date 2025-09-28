"use client";
import { useState } from 'react';
import styles from './LenguageToggle.module.css'; // Asumiendo que los estilos de botón están aquí

export default function LanguageToggle() {
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ES' ? 'EN' : 'ES'));
    // En una app real, aquí llamarías a una función de tu librería de i18n
  };

  return (
    <button onClick={toggleLanguage} className={styles.language_toggle} aria-label={`Cambiar idioma a ${language === 'ES' ? 'Inglés' : 'Español'}`}>
      {language}
    </button>
  );
}