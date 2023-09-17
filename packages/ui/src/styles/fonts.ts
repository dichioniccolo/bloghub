import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const fontMapper = {
  "font-sans": inter.variable,
};
