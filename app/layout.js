import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--fonte-manrope",
});

export const metadata = {
  title: "Meu CRM",
  description: "Contatos e oportunidades de negócio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
