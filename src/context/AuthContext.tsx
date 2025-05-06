import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, getUser } from "@/utils/api/coreApi";
import { UserGetByIdType } from "@/utils/api/coreTypes";
// interface User {
//   id: number;
//   name: string;
//   role: Role;
// }

// interface User extends UserDto {}

interface AuthContextType {
  user: UserGetByIdType | null;
  login: (userNameOrEmail: string, password: string) => Promise<boolean>;
  token?: string | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserGetByIdType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in (optional: from sessionStorage or localStorage)
  useEffect(() => {
    // جلب التوكن والمستخدم من localStorage فقط
    let storedToken = localStorage.getItem("token");
    let storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Login using API
  const login = async (userNameOrEmail: string, password: string): Promise<boolean> => {
    try {
      const result = await loginUser(userNameOrEmail, password);
      if (result.error || !result.data) {
        throw new Error(result.error || 'Login failed');
      }
      setToken(result.data.accessToken.toString());
      localStorage.setItem("token", result.data.accessToken.toString());
      // جلب بيانات المستخدم بعد تسجيل الدخول
      const userInfo = await getUser(result.data.userId);
      if (userInfo.error || !userInfo.data) {
        throw new Error(userInfo.error || 'Failed to fetch user info');
      }
      setUser(userInfo.data as UserGetByIdType);
      localStorage.setItem("user", JSON.stringify(userInfo.data));
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
