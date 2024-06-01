import { Roboto, Inter, Righteous } from "next/font/google";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});
const inter = Inter({ subsets: ["latin"] });

const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
});

const useFonts = () => {
  return { roboto, inter, righteous };
};

export default useFonts;
