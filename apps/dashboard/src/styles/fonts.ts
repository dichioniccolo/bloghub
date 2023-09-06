import { Inter } from "next/font/google";

// export const cal = localFont({
//   src: "./CalSans-SemiBold.otf",
//   variable: "--font-sans",
//   weight: "600",
//   display: "swap",
// });

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const fontMapper = {
  "font-sans": inter.variable,
};
