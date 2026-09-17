import React, { useState } from "react";
import { User, Mail, Phone, Briefcase, MapPin, Clock, FileText, CheckCircle2, Save } from "lucide-react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { TIMEZONE_OPTIONS } from "../../../data/settings";

export default function ProfileInformation({ profile, onUpdateProfile }) {
  const [formData, setFormData] = useState({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile(formData);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 500);
  };

  return (
    <Card
      title="Personal & Professional Information"
      subtitle="Update your administrator credentials, contact details, and organization role information."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            icon={User}
            required
          />

          <Input
            label="Last Name"
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />

          <Input
            label="Super Admin Email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            icon={Mail}
            helperText="Primary email used for system OTP and critical platform alerts."
            required
          />

          <Input
            label="Mobile Phone"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            icon={Phone}
            placeholder="+1 (555) 000-0000"
          />

          <Input
            label="Job Designation"
            value={formData.designation || ""}
            onChange={(e) => handleChange("designation", e.target.value)}
            icon={Briefcase}
          />

          <Input
            label="Department / Team"
            value={formData.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
          />

          <Input
            label="Location / Region"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            icon={MapPin}
          />

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
              <span>Timezone</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                <Clock className="w-4 h-4" />
              </div>
              <select
                value={formData.timezone || "America/Los_Angeles"}
                onChange={(e) => handleChange("timezone", e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-3 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {TIMEZONE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bio / Operational Notes */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-text-primary mb-1.5">
            Operational Bio & Responsibilities
          </label>
          <textarea
            rows={3}
            value={formData.bio || ""}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Brief description of responsibilities..."
            className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border p-3 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div>
            {savedSuccess && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4" /> Profile details updated successfully.
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSaving}
            className="font-bold"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Profile
          </Button>
        </div>
      </form>
    </Card>
  );
}
