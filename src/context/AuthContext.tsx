import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSavedUser, getToken } from "@/services/api";
import type { AuthUser } from "@/services/auth.service";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On app start, restore the saved session (if any)
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const saved = await getSavedUser<AuthUser>();
      if (token && saved) setUser(saved);
      setLoading(false);
    })();
  }, []);

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);