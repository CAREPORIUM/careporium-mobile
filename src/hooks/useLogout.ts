import { useRef, useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/auth.service";

export function useLogout() {
  const { setUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const busy = useRef(false);

  const handleLogout = async () => {
    if (busy.current) return; 
    busy.current = true;
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  return { handleLogout, loggingOut };
}