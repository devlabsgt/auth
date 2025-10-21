// RUTA: ./app/layout.tsx

import "./globals.css";
import { Geist } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Gestión Municipal", // Puedes cambiar esto si quieres
  description: "Sistema de Gestión Municipal", // Puedes cambiar esto
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  maximumScale: 1,
  userScalable: false
};

const geistSans = Geist({ display: "swap", subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es" className={geistSans.className} suppressHydrationWarning>
      <body className="text-foreground"> {/* Usando clases de tu globals.css */}
        <div className="flex flex-col min-h-screen">
          {/* Aquí podrías añadir una barra de navegación simple si la necesitas */}
          {/* <nav>...</nav> */}

          <main className="flex flex-col flex-grow w-full max-w-4xl mx-auto px-4 py-8"> {/* Estilos básicos para el contenido principal */}
            {children}
          </main>

          {/* Aquí podrías añadir un footer simple si lo necesitas */}
          {/* <footer>...</footer> */}

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
          {/* Quitamos el script de lordicon si no lo usas */}
        </div>
      </body>
    </html>
  );
}