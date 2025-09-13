import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const handleLogin = (tenantId: string, email: string) => {
    setCurrentTenant(tenantId);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentTenant("");
    setUserEmail("");
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      tenantId={currentTenant}
      userEmail={userEmail}
      onLogout={handleLogout}
    />
  );
};

export default Index;
