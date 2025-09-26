import Cards from "@/components/conteiners/cards";
import Login from "@/components/forms/login";
import Image from "next/image";

export default function Home() {
  const login = () => {
    return (<Login />);
  }

  return (
    <div className="container">
        <div>
            <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="logo-image"
            />
            <h1 className="app-title">Bankpry</h1>
            <p className="app-description">Tu banco en línea seguro y confiable</p>
        </div>
      <Login />
    </div>
  );
}
