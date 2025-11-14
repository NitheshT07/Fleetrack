import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('fleettrack_user');
    const token = localStorage.getItem('fleettrack_token') || localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!email || password.length < 6) {
        alert("Please enter a valid email and password (min 6 characters)");
        return false;
      }

      const { authApi } = await import('../api/authApi');
      const response = await authApi.login(email, password);

      if (response.token && response.user) {
        const loggedInUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role || 'Admin',
          avatar: response.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(response.user.name)}`
        };

        localStorage.setItem('fleettrack_user', JSON.stringify(loggedInUser));
        localStorage.setItem('fleettrack_token', response.token);
        localStorage.setItem('token', response.token); // Also store for API client
        setUser(loggedInUser);
        return true;
      }
      
      alert(response.message || "Login failed");
      return false;
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || err.message || "Invalid credentials");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      if (!name || !email || password.length < 6) {
        alert("Please fill all fields (password ≥ 6 chars)");
        return false;
      }

      const { authApi } = await import('../api/authApi');
      const response = await authApi.register({ name, email, password });

      if (response.message === "User registered successfully" || response.success) {
        alert("Registration successful! Please login.");
        return true;
      }

      alert(response.message || "Registration failed");
      return false;
    } catch (err: any) {
      console.error("Register error:", err);
      alert(err.response?.data?.message || err.message || "Email already exists");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('fleettrack_user');
    localStorage.removeItem('fleettrack_token');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};



// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { User } from "../types";
// import axios from "axios";

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // Restore session from localStorage on refresh
//   useEffect(() => {
//     const storedUser = localStorage.getItem("fleettrack_user");
//     const token = localStorage.getItem("fleettrack_token");
//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // ✅ LOGIN — calls your real backend
//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       if (!email || password.length < 6) {
//         alert("Please enter a valid email and password (min 6 characters)");
//         return false;
//       }

//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       const { token, user: userData } = res.data;

//       const loggedInUser: User = {
//         id: userData.id,
//         name: userData.name,
//         email: userData.email,
//         role: "User",
//         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
//           userData.name
//         )}`,
//       };

//       localStorage.setItem("fleettrack_user", JSON.stringify(loggedInUser));
//       localStorage.setItem("fleettrack_token", token);
//       setUser(loggedInUser);
//       return true;
//     } catch (err: any) {
//       console.error("Login error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Invalid credentials");
//       return false;
//     }
//   };

//   // ✅ REGISTER — calls your real backend
//   const register = async (
//     name: string,
//     email: string,
//     password: string
//   ): Promise<boolean> => {
//     try {
//       if (!name || !email || password.length < 6) {
//         alert("Please fill all fields (password ≥ 6 chars)");
//         return false;
//       }

//       const res = await axios.post("http://localhost:5000/api/auth/register", {
//         name,
//         email,
//         password,
//       });

//       if (res.data.message === "User registered successfully") {
//         alert("Registration successful! Please login.");
//         return true;
//       }

//       alert(res.data.message || "Registration failed");
//       return false;
//     } catch (err: any) {
//       console.error("Register error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Email already exists");
//       return false;
//     }
//   };

//   // ✅ LOGOUT
//   const logout = () => {
//     localStorage.removeItem("fleettrack_user");
//     localStorage.removeItem("fleettrack_token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook for easy access
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
