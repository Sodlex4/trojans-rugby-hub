import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (isAdmin: boolean) => void;
  initialMode?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, onAuth, initialMode = "login" }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = () => {
    if (!form.username || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "login") {
      if (form.username === "admin" && form.password === "admin123") {
        toast.success("Welcome Admin!");
        onAuth(true);
      } else {
        toast.success("Login successful!");
        onAuth(false);
      }
    } else {
      toast.success("Registration successful!");
      onAuth(false);
    }

    setForm({ username: "", email: "", password: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display text-primary tracking-wide">
                {mode === "login" ? "LOGIN" : "REGISTER"}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input-field"
                />
              </div>

              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-foreground font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                />
              </div>

              <motion.button
                onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl 
                         font-display text-lg tracking-wide
                         hover:bg-trojan-green-dark transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {mode === "login" ? "LOGIN" : "REGISTER"}
              </motion.button>

              <p className="text-center text-muted-foreground">
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === "login" ? "Register" : "Login"}
                </button>
              </p>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Demo Admin: username = <span className="font-mono text-primary">admin</span>, 
                  password = <span className="font-mono text-primary">admin123</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
