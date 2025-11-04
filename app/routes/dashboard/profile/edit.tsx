import { useState } from "react";
import { toast, useSonner } from "sonner";
import { AvatarUpload } from "~/components/profile/AvatarUpload";
import { MarkdownEditor } from "~/components/profile/MarkdownEditor";
import { SocialLinks } from "~/components/profile/SocialLinks";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";


interface ProfileData {
  username: string;
  email: string;
  bio: string;
  avatar: string | null;
  website: string;
  github: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  customBio: string;
}

const EditProfile = () => {
  const { toasts } = useSonner();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    email: "",
    bio: "",
    avatar: null,
    website: "",
    github: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    customBio: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  const validateUsername = (username: string): string | null => {
    if (!username) return "Username is required";
    if (username.length > 30) return "Username must be 30 characters or less";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    return null;
  };

  const validateBio = (bio: string): string | null => {
    if (!bio) return "Bio is required";
    if (bio.length > 160) return "Bio must be 160 characters or less";
    return null;
  };

  const validateUrl = (url: string): string | null => {
    if (!url) return null; // Optional field
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation
    let error: string | null = null;
    if (field === "username") error = validateUsername(value);
    if (field === "email") error = validateEmail(value);
    if (field === "bio") error = validateBio(value);
    if (field === "website") error = validateUrl(value);

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSave = async () => {
    // Validate all required fields
    const newErrors: Partial<Record<keyof ProfileData, string>> = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const bioError = validateBio(formData.bio);
    if (bioError) newErrors.bio = bioError;

    const websiteError = validateUrl(formData.website);
    if (websiteError) newErrors.website = websiteError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast("Please fill in all required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast("Changes saved successfully", {
        description: "Your changes have been saved successfully.",
      });
    }, 1500);
  };

  const handleCancel = () => {
    // Reset form or navigate away
    toast("Changes cancelled", {
      description: "Your changes have been cancelled.",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information and settings</p>
        </div>

        <div className="space-y-6">
          {/* Avatar Section */}
          <Card className="shadow-[var(--shadow-medium)] transition-shadow hover:shadow-[var(--shadow-strong)]">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile picture (JPG or PNG, max 2MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                currentAvatar={formData.avatar}
                onAvatarChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-[var(--shadow-medium)] transition-shadow hover:shadow-[var(--shadow-strong)]">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details visible to others</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={errors.username ? "border-destructive" : ""}
                  maxLength={30}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.username.length}/30 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  Bio <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="bio"
                  placeholder="A short description about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={errors.bio ? "border-destructive" : ""}
                  maxLength={160}
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className={errors.website ? "border-destructive" : ""}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card className="shadow-[var(--shadow-medium)] transition-shadow hover:shadow-[var(--shadow-strong)]">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialLinks
                github={formData.github}
                facebook={formData.facebook}
                instagram={formData.instagram}
                linkedin={formData.linkedin}
                onChange={(field, value) => handleInputChange(field as keyof ProfileData, value)}
              />
            </CardContent>
          </Card>

          {/* Custom Bio with Markdown */}
          <Card className="shadow-[var(--shadow-medium)] transition-shadow hover:shadow-[var(--shadow-strong)]">
            <CardHeader>
              <CardTitle>Extended Bio</CardTitle>
              <CardDescription>Write a detailed bio using Markdown formatting</CardDescription>
            </CardHeader>
            <CardContent>
              <MarkdownEditor
                value={formData.customBio}
                onChange={(value) => handleInputChange("customBio", value)}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="sm:order-2 bg-gradient-to-r from-primary to-primary-hover"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
