import { AuthProvider } from "@/context/AuthContext";
import { MenuProvider } from "@/context/MenuContext";
import GlobalErrorBar from "@/components/GlobalErrorBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AuthProvider>
          <MenuProvider>
            <GlobalErrorBar />
            {children}
          </MenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}