import Cards from "@/components/conteiners/cards";
import Login from "@/components/forms/login";

export default function Home() {
  const login = () => {
    return (<Login />);
  }

  return (
    <div>
      Hola
      <Cards>{login()}</Cards>
    </div>
  );
}
