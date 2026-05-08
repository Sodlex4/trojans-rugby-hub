import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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
            <label className="block text-foreground font-semibold mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="input-field"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-foreground font-semibold mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="input-field pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
            {isLoggingIn ? "Signing in..." : "Login"}
          </motion.button>

          <div className="text-center pt-4">
            <Link to="/" className="text-primary hover:underline text-sm inline-flex items-center gap-1">
              <ArrowLeft size={14} />
              Back to homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
