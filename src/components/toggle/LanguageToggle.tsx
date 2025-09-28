"use client";
import styles from './LenguageToggle.module.css';
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "en" : "es";
    const newPath = `/${newLocale}${pathname.replace(/^\/(es|en)/, '')}`;
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={styles.language_toggle}
      aria-label={`Cambiar idioma a ${locale === "es" ? "Inglés" : "Español"}`}
    >
      {locale.toUpperCase()}
    </button>
  );
}
