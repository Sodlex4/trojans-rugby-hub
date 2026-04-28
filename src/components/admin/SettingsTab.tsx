import { useState, useEffect } from "react";
import { Save, Globe, Phone, Heart, UserPlus, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getSettings, saveSettings, updateSettings, getSiteLogo, type Settings } from "@/lib/auth";

interface SettingsTabProps {
  onSettingsChange: () => void;
}

const SettingsTab = ({ onSettingsChange }: SettingsTabProps) => {
  const [settings, setSettings] = useState<Settings>({
    siteTitle: "Trojans Murang'a RFC",
    siteTagline: "Champions of Central Kenya Rugby",
    siteDescription: "Building champions, fostering community, celebrating excellence in Kenyan rugby.",
    siteLogo: "",
    contactEmail: "info@trojans.co.ke",
    contactPhone: "+254 700 000 000",
    contactAddress: "Murang'a, Kenya",
    socialFacebook: "https://facebook.com/trojansrugby",
    socialTwitter: "https://twitter.com/trojansrugby",
    socialInstagram: "https://instagram.com/trojansrugby",
    socialYouTube: "https://youtube.com/trojansrugby",
    clubFounded: "2015",
    clubStadium: "Murang'a Sports Complex",
    joinAutoAccept: false,
    notifyEmail: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await saveSettings(settings);
      toast.success("Settings saved successfully!");
      onSettingsChange();
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      setSettings({ ...settings, siteLogo: result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setSettings({ ...settings, siteLogo: "" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-trojan-green-dark transition-colors"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>

      <div className="grid gap-6">
        {/* Logo Management */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Site Logo</h3>
          </div>
         
          <div className="space-y-4">
            {/* Current Logo Preview */}
            <div className="flex items-center gap-4">
              <img 
                src={logoPreview || settings.siteLogo || "/logo.jpg"} 
                alt="Current Logo" 
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Current Logo</p>
                <p className="text-xs text-muted-foreground">
                  {(settings.siteLogo || logoPreview) ? "Custom logo uploaded" : "Using default logo"}
                </p>
              </div>
            </div>
            
            {/* Upload Input */}
            <div className="flex items-center gap-3">
              <label className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label 
                  htmlFor="logo-upload"
                  className="input-field flex items-center justify-center gap-2 cursor-pointer hover:bg-muted/50"
                >
                  Choose Logo Image
                </label>
              </label>
              
              {(settings.siteLogo || logoPreview) && (
                <button
                  onClick={handleRemoveLogo}
                  className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                >
                  Remove Custom Logo
                </button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Recommended: Square image, at least 200x200px. Max 2MB. Will be displayed at 48x48px in header.
            </p>
          </div>
        </div>

        {/* Site Info */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Site Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Site Title</label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tagline</label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="input-field h-24 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Contact Information</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Social Media Links</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Facebook className="text-blue-600" size={20} />
              <input
                type="url"
                placeholder="Facebook URL"
                value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                className="input-field flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Twitter className="text-blue-400" size={20} />
              <input
                type="url"
                placeholder="Twitter URL"
                value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                className="input-field flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Instagram className="text-pink-600" size={20} />
              <input
                type="url"
                placeholder="Instagram URL"
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="input-field flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Youtube className="text-red-600" size={20} />
              <input
                type="url"
                placeholder="YouTube URL"
                value={settings.socialYouTube}
                onChange={(e) => setSettings({ ...settings, socialYouTube: e.target.value })}
                className="input-field flex-1"
              />
            </div>
          </div>
        </div>

        {/* Club Info */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-primary" size={24} />
            <h3 className="font-semibold text-foreground text-lg">Club Information</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Founded Year</label>
              <input
                type="text"
                value={settings.clubFounded}
                onChange={(e) => setSettings({ ...settings, clubFounded: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Stadium Name</label>
              <input
                type="text"
                value={settings.clubStadium}
                onChange={(e) => setSettings({ ...settings, clubStadium: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Join Request Settings */}
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
                onClick={() => setSettings({ ...settings, joinAutoAccept: !settings.joinAutoAccept })}
                className={`w-14 h-7 rounded-full transition-colors ${
                  settings.joinAutoAccept ? "bg-primary" : "bg-muted"
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.joinAutoAccept ? "translate-x-8" : "translate-x-1"
                }`} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Notification Email</label>
              <input
                type="email"
                placeholder="Email for join request notifications"
                value={settings.notifyEmail}
                onChange={(e) => setSettings({ ...settings, notifyEmail: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
