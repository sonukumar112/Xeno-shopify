import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Store, Mail, Lock, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onLogin: (tenantId: string, email: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      // Mock authentication - in real app, this would validate credentials
      if (email && password) {
        // Assign tenant based on email domain for demo
        const tenantId = email.includes("fashion") ? "tenant-1" : 
                        email.includes("tech") ? "tenant-2" : "tenant-3";
        
        onLogin(tenantId, email);
        toast({
          title: "Welcome back!",
          description: "Successfully logged into your dashboard.",
        });
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const demoLogin = (tenantType: string) => {
    const demoCredentials = {
      fashion: { email: "admin@fashion-store-pro.com", tenant: "tenant-1" },
      tech: { email: "admin@tech-gadgets-inc.com", tenant: "tenant-2" },
      home: { email: "admin@home-garden-co.com", tenant: "tenant-3" }
    };

    const creds = demoCredentials[tenantType as keyof typeof demoCredentials];
    setEmail(creds.email);
    setPassword("demo123");
    
    setTimeout(() => {
      onLogin(creds.tenant, creds.email);
      toast({
        title: "Demo Access Granted",
        description: `Logged in as ${creds.email}`,
      });
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Store className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Xeno Analytics</h1>
          </div>
          <p className="text-muted-foreground">
            Multi-tenant Shopify insights dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="glass-card p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="admin@yourstore.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <Separator />

          {/* Demo Access */}
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin("fashion")}
                className="text-xs"
              >
                Fashion Store Pro
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin("tech")}
                className="text-xs"
              >
                Tech Gadgets Inc
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin("home")}
                className="text-xs"
              >
                Home & Garden Co
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Built for Xeno FDE Internship Assignment 2025
        </p>
      </div>
    </div>
  );
};
