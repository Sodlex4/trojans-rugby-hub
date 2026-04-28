import { useState } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (isAdmin: boolean) => void;
  initialMode?: "login" | "register" | "join";
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AuthModal = ({ isOpen, onClose, onAuth, initialMode = "login" }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register" | "join">(initialMode);
  const [loginForm, setLoginForm] = useState({ username: "", email: "", password: "" });
  const [joinForm, setJoinForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = () => {
    if (!loginForm.username || !loginForm.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "login" || mode === "register") {
      if (loginForm.username === "admin" && loginForm.password === "admin123") {
        toast.success("Welcome Admin!");
        onAuth(true);
      } else {
        toast.success("Login successful!");
        onAuth(false);
      }
    }

    setLoginForm({ username: "", email: "", password: "" });
    onClose();
  };

  const handleJoinSubmit = async () => {
    if (!joinForm.name || !joinForm.email || !joinForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/join-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(joinForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Your request has been sent to the admin!");
        setJoinForm({ name: "", email: "", phone: "", message: "" });
        onClose();
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (error) {
      toast.error("Failed to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              <h2 className="text-2xl font-display font-bold text-primary uppercase">
                {mode === "login" ? "LOGIN" : mode === "register" ? "REGISTER" : "JOIN CLUB"}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Join Club Form */}
            {mode === "join" ? (
              <div className="space-y-5">
                <p className="text-muted-foreground text-sm mb-4">
                  Fill out the form below to request to join Trojans RFC. We'll review your request and get back to you.
                </p>
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Full Name <span className="text-trojan-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={joinForm.name}
                    onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Email <span className="text-trojan-red">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={joinForm.email}
                    onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={joinForm.phone}
                    onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Message to Admin <span className="text-trojan-red">*</span>
                  </label>
                  <textarea
                    placeholder="Tell us about yourself and why you want to join..."
                    value={joinForm.message}
                    onChange={(e) => setJoinForm({ ...joinForm, message: e.target.value })}
                    className="input-field h-24 resize-none"
                    required
                  />
                </div>

                <motion.button
                  onClick={handleJoinSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl 
                           font-display font-bold text-lg uppercase
                           hover:bg-trojan-green-dark transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send size={18} />
                      SEND REQUEST
                    </span>
                  )}
                </motion.button>

                <div className="flex justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => setMode("login")}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    Already a member? Login
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    Admin? Register
                  </button>
                </div>
              </div>
            ) : (
              /* Login/Register Form */
              <div className="space-y-5">
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
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
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
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
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="input-field"
                  />
                </div>

                <motion.button
                  onClick={handleLoginSubmit}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl 
                           font-display font-bold text-lg uppercase
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

                {mode === "login" && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                      Want to join the club? Click below to send a request to the admin.
                    </p>
                    <button
                      onClick={() => setMode("join")}
                      className="w-full bg-accent text-accent-foreground py-3 rounded-xl 
                               font-display font-bold text-sm uppercase
                               hover:bg-trojan-red-dark transition-colors"
                    >
                      Join Trojans RFC
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Demo Admin: username = <span className="font-mono text-primary">admin</span>, 
                    password = <span className="font-mono text-primary">admin123</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;