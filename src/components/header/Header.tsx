"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/header/Navbar';
import HamburgerButton from '@/components/header/HamburgerButton';
import LanguageToggle from '@/components/toggle/LanguageToggle';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_content}>
        <Link href="/" className={styles.logo_container} onClick={closeMenu}>
          <Image src="/logo.png" alt="Logo de BanCrap" width={40} height={40} />
          <span className={styles.title}>BanCrap</span>
        </Link>

        <div className={styles.nav_desktop}>
          <Navbar isOpen={true} />
        </div>

        <div className={styles.actions_container}>
          <LanguageToggle />
          <div className={styles.hamburger_container}>
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </div>
      
      {/* El Navbar para móvil se renderiza fuera del flujo principal */}
      <div className={styles.nav_mobile}>
        <Navbar isOpen={isMenuOpen} onLinkClick={closeMenu} />
      </div>
    </header>
  );
}