import localFont from "next/font/local";

export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-sans",
  weight: "600",
  display: "swap",
});

export const fontMapper = {
  "font-sans": cal.variable,
};
