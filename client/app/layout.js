"use client";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const siliguri = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-siliguri",
});
import { Provider } from "react-redux";
import { store } from "@/store/store";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider store={store}>
        <body className={inter.className}>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </body>
      </Provider>
    </html>
  );
}
