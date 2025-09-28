import { redirect } from "@/i18n/routing";

export default function Home() {
  redirect({
    href: '/login',
    locale: 'es', // o el idioma que uses, por ejemplo 'en'
  });

  return null;
}
