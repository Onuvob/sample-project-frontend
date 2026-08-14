// "use client";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "@/services/userService";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//     const router = useRouter();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const token = localStorage.getItem("accessToken");

//         if (!token) {
//             router.push("/login"); // redirect if no token
//             return;
//         }

//         getCurrentUser()
//             .then((data) => setUser(data))
//             .catch(() => {
//                 localStorage.removeItem("accessToken");
//                 router.push("/login"); // redirect on error
//             })
//             .finally(() => setLoading(false));
//     }, [router]);

//     return (
//         <AuthContext.Provider value={{ user, setUser, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
// export const useAuth = () => useContext(AuthContext);


// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "@/services/userService";
// import { routes } from "@/routes";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Define public routes that don't require auth
//   const publicRoutes = [routes.home, routes.login, routes.forgotPassword, routes.test];

//   useEffect(() => {
//     // If current route is public, just stop loading (no redirect)
//     if (publicRoutes.includes(pathname)) {
//       setLoading(false);
//       return;
//     }

//     const token = localStorage.getItem("accessToken");

//     // If no token and route is protected -> redirect
//     if (!token) {
//       router.replace(routes.login);
//       setLoading(false); // ✅ prevent infinite loop
//       return;
//     }

//     // Otherwise validate token -> fetch user
//     getCurrentUser()
//       .then((data) => setUser(data))
//       .catch(() => {
//         localStorage.removeItem("accessToken");
//         router.replace(routes.login);
//       })
//       .finally(() => setLoading(false));
//   }, [pathname, router]);

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);


"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/services/userService";
import { routes } from "@/routes";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(() => {
    // Try to read token immediately
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return token ? {} : null; // temp placeholder to prevent flicker
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Fetch actual user
    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
