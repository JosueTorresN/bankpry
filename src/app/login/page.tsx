import Login from "@/components/forms/login/login";
import Image from "next/image";
import styles from "./Login.module.css"

export default function Home() {

  return (
    <div className={styles.container}>
        <div>
            <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className={styles.logo_image}
            />
            <h1 className={styles.app_title}>Bankpry</h1>
            <p className={styles.app_description}>Tu banco en línea seguro y confiable</p>
        </div>
      <Login />
    </div>
  );
}
