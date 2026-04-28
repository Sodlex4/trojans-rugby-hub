import { useState, useEffect } from "react";
import { Check, X, Mail, Phone, Calendar, UserPlus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getAllJoinRequests, acceptJoinRequest, declineJoinRequest, type JoinRequest } from "@/lib/auth";

interface JoinRequestsTabProps {
  onRefresh: () => void;
}

const JoinRequestsTab = ({ onRefresh }: JoinRequestsTabProps) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJoinRequests();
  }, []);

  const fetchJoinRequests = async () => {
    setIsLoading(true);
    try {
      const requests = await getAllJoinRequests();
      setJoinRequests(requests);
    } catch (error) {
      console.error("Failed to fetch join requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (id: number) => {
    try {
      await acceptJoinRequest(id);
      toast.success("Request accepted!");
      fetchJoinRequests();
      onRefresh();
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (id: number) => {
    try {
      await declineJoinRequest(id);
      toast.success("Request declined");
      fetchJoinRequests();
      onRefresh();
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Join Requests</h2>
        <button 
          onClick={fetchJoinRequests}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Search size={18} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : joinRequests.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <UserPlus className="mx-auto text-muted-foreground mb-4" size={40} />
          <p className="text-muted-foreground">No join requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {joinRequests.map((request) => (
            <div 
              key={request.id} 
              className={`bg-card rounded-xl p-5 border transition-all hover:shadow-md ${
                request.status === "PENDING" 
                  ? "border-l-4 border-l-trojan-gold" 
                  : request.status === "ACCEPTED"
                  ? "border-l-4 border-l-primary"
                  : "border-l-4 border-l-muted opacity-60"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground text-lg">{request.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      request.status === "PENDING" 
                        ? "bg-trojan-gold/20 text-trojan-gold-dark"
                        : request.status === "ACCEPTED"
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <a href={`mailto:${request.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Mail size={14} />
                      {request.email}
                    </a>
                    {request.phone && (
                      <a href={`tel:${request.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Phone size={14} />
                        {request.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(request.createdAt)}
                    </span>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Message: </span>
                      {request.message || "No message provided"}
                    </p>
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <div className="flex gap-2 lg:flex-col lg:w-32">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
                    >
                      <Check size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-red-dark transition-colors"
                    >
                      <X size={16} />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default JoinRequestsTab;
