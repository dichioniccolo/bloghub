import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// const cal = localFont({
//   src: "./CalSans-SemiBold.otf",
//   variable: "--font-sans",
//   weight: "500",
//   display: "swap",
// });

export const fontMapper = {
  "font-sans": inter.variable,
};
