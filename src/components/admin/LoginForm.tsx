import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { login, getSiteLogo } from "@/lib/auth";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginLogo, setLoginLogo] = useState("/logo.jpg");

  useEffect(() => {
    getSiteLogo().then(setLoginLogo);
  }, []);

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      toast.error("Please enter username and password");
      return;
    }
    
    setIsLoggingIn(true);
    const result = await login(loginForm.username, loginForm.password);
    setIsLoggingIn(false);
    
    if (result.success) {
      onLoginSuccess();
      toast.success("Welcome back!");
    } else {
      toast.error(result.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl border border-border">
        <div className="text-center mb-8">
          <img 
            src={loginLogo} 
            alt="Trojans Logo" 
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-primary shadow-lg" 
          />
          <h1 className="text-2xl font-display font-bold text-foreground uppercase">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage the club</p>
        </div>
         
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
          <div>
            <label className="block text-foreground font-semibold mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-foreground font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="input-field"
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl 
                     font-display font-bold text-lg uppercase
                     hover:bg-trojan-green-dark transition-all duration-300
                     disabled:opacity-50"
            whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
            whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
          >
            {isLoggingIn ? "Signing in..." : "LOGIN"}
          </motion.button>
          
          <div className="text-center pt-4">
            <Link to="/" className="text-primary hover:underline text-sm">
              ← Back to homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
