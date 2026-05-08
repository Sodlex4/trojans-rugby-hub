import { useState } from "react";
import { X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { submitJoinRequest } from "@/lib/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [joinForm, setJoinForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!joinForm.name.trim()) errs.name = "Full name is required";
    if (!joinForm.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(joinForm.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!joinForm.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleJoinSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await submitJoinRequest(joinForm);
      
      if (result.success) {
        setShowSuccess(true);
        toast.success("Request sent! Waiting for admin approval.");
      } else {
        toast.error(result.error || "Failed to send request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setJoinForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setShowSuccess(false);
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
          onClick={handleClose}
        >
          <motion.div
            className="bg-card rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 pt-8 pb-4 shrink-0">
              <h2 className="text-2xl font-display font-bold text-primary uppercase">
                {showSuccess ? "REQUEST SENT" : "JOIN CLUB"}
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-8 pb-8">
            {/* Success Message */}
            {showSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground mb-6">
                  Your request has been sent to the admin. We'll review it and get back to you at <span className="font-semibold text-foreground">{joinForm.email}</span>
                </p>
                <button
                  onClick={handleClose}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-trojan-green-dark transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Join Club Form */
              <form onSubmit={handleJoinSubmit} className="space-y-5" noValidate>
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
                    onChange={(e) => {
                      setJoinForm({ ...joinForm, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    className={`input-field ${errors.name ? "ring-2 ring-trojan-red" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-trojan-red text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-foreground font-semibold mb-2">
                    Email <span className="text-trojan-red">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={joinForm.email}
                    onChange={(e) => {
                      setJoinForm({ ...joinForm, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`input-field ${errors.email ? "ring-2 ring-trojan-red" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-trojan-red text-sm mt-1">{errors.email}</p>
                  )}
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
                    onChange={(e) => {
                      setJoinForm({ ...joinForm, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    className={`input-field h-24 resize-none ${errors.message ? "ring-2 ring-trojan-red" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-trojan-red text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-muted text-foreground px-4 py-3 rounded-xl font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl 
                             font-display font-bold uppercase
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
                        Send Request
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;