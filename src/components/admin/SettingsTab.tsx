import { useState, useEffect } from "react";
import { Save, Globe, Phone, Heart, UserPlus, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getSettings, saveSettings, type Settings } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface SettingsTabProps {
  onSettingsChange: () => void;
}

const SettingsTab = ({ onSettingsChange }: SettingsTabProps) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch {
      console.error("Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await saveSettings(settings);
      toast.success("Settings saved successfully!");
      onSettingsChange();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be less than 2MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setSettings(s => s ? { ...s, siteLogo: result } : s);
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!settings) return null;

  const update = (key: keyof Settings, value: any) => setSettings({ ...settings, [key]: value });

  const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="input-field" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Site Logo</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={logoPreview || settings.siteLogo || "/logo.jpg"}
              alt="Current Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-border"
            />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Logo</p>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <span className="input-field inline-block cursor-pointer hover:bg-muted/50 text-sm">Choose Logo Image</span>
              </label>
              {(settings.siteLogo || logoPreview) && (
                <button onClick={() => { setLogoPreview(null); update("siteLogo", ""); }} className="block mt-2 text-xs text-accent hover:underline">
                  Remove custom logo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Site Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Site Title" value={settings.siteTitle} onChange={(e: any) => update("siteTitle", e.target.value)} />
            <InputField label="Tagline" value={settings.siteTagline} onChange={(e: any) => update("siteTagline", e.target.value)} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea value={settings.siteDescription} onChange={(e) => update("siteDescription", e.target.value)} className="input-field h-24 resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Contact Information</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <InputField label="Email" type="email" value={settings.contactEmail} onChange={(e: any) => update("contactEmail", e.target.value)} />
            <InputField label="Phone" type="tel" value={settings.contactPhone} onChange={(e: any) => update("contactPhone", e.target.value)} />
            <InputField label="Address" value={settings.contactAddress} onChange={(e: any) => update("contactAddress", e.target.value)} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Social Media Links</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Facebook, label: "Facebook URL", value: settings.socialFacebook, key: "socialFacebook", color: "text-blue-600" },
              { icon: Twitter, label: "Twitter URL", value: settings.socialTwitter, key: "socialTwitter", color: "text-blue-400" },
              { icon: Instagram, label: "Instagram URL", value: settings.socialInstagram, key: "socialInstagram", color: "text-pink-600" },
              { icon: Youtube, label: "YouTube URL", value: settings.socialYouTube, key: "socialYouTube", color: "text-red-600" },
            ].map(({ icon: Icon, label, value, key, color }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className={color} size={20} />
                <input type="url" placeholder={label} value={value} onChange={(e) => update(key as keyof Settings, e.target.value)} className="input-field flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Club Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Founded Year" value={settings.clubFounded} onChange={(e: any) => update("clubFounded", e.target.value)} />
            <InputField label="Stadium Name" value={settings.clubStadium} onChange={(e: any) => update("clubStadium", e.target.value)} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Join Request Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Auto-accept requests</p>
                <p className="text-sm text-muted-foreground">Automatically accept all join requests</p>
              </div>
              <button
                onClick={() => update("joinAutoAccept", !settings.joinAutoAccept)}
                className={`w-14 h-7 rounded-full transition-colors ${settings.joinAutoAccept ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings.joinAutoAccept ? "translate-x-8" : "translate-x-1"}`} />
              </button>
            </div>
            <InputField label="Notification Email" type="email" placeholder="Email for join request notifications" value={settings.notifyEmail} onChange={(e: any) => update("notifyEmail", e.target.value)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
