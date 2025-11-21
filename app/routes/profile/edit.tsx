import { useState, useEffect } from "react";
import { Form, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { AvatarUpload } from "~/components/profile/AvatarUpload";
import { profileApi } from "~/api/profile";
import { useAuth } from "~/hooks/useAuth";
import type { UpdateProfileRequest, SocialMediaLinks } from "~/types";

export function meta() {
    return [
        { title: "Edit Profile - Blog Platform" },
        { name: "description", content: "Edit your profile information" },
    ];
}

export default function EditProfile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    // Fetch current profile by user ID
    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile", user?.id],
        queryFn: () => profileApi.getProfileById(user!.id),
        enabled: !!user?.id,
    });

    // Form state
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        username: "",
        email: "",
        bio: "",
        website: "",
        customInformation: "",
        socialMediaLinks: {},
    });

    const [markdownContent, setMarkdownContent] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Initialize form with profile data
    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username,
                email: profile.email,
                bio: profile.bio || "",
                website: profile.website || "",
                customInformation: profile.customInformation || "",
                socialMediaLinks: profile.socialMediaLinks || {},
            });
            setMarkdownContent(profile.customProfileMarkdown || "");
            setAvatarUrl(profile.avatar || null);
        }
    }, [profile]);

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfileRequest) => profileApi.patchProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    // Update markdown mutation
    const updateMarkdownMutation = useMutation({
        mutationFn: (content: string) => profileApi.updateProfileMarkdown(content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
            toast.success("Profile markdown updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update markdown");
        },
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socialMediaLinks: {
                ...prev.socialMediaLinks,
                [platform]: value,
            },
        }));
    };

    const handleAvatarUpload = (url: string) => {
        setAvatarUrl(url);
    
        setFormData((prev) => ({ ...prev, avatar: url }));
        console.log(formData.avatar);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Update profile information
            await updateProfileMutation.mutateAsync(formData);

            // Update markdown if changed
            if (markdownContent !== profile?.customProfileMarkdown) {
                await updateMarkdownMutation.mutateAsync(markdownContent);
            }

            // Navigate to profile view
            setTimeout(() => {
                navigate(`/profile/${profile?.username}`);
            }, 1000);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <UserIcon className="w-8 h-8" />
                    Edit Profile
                </h1>
                <p className="text-muted-foreground mt-2">
                    Update your profile information and customize your public page
                </p>
            </div>

            <Form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Upload a profile picture</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AvatarUpload
                            currentAvatar={avatarUrl}
                            onAvatarChange={(url) => handleAvatarUpload(url || "")}
                        />
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Your public profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="johndoe"
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="customInformation">Custom Information</Label>
                            <Textarea
                                id="customInformation"
                                name="customInformation"
                                value={formData.customInformation}
                                onChange={handleInputChange}
                                placeholder="Additional information..."
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>Connect your social media accounts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {["GITHUB", "TWITTER", "LINKEDIN", "FACEBOOK", "INSTAGRAM"].map(
                            (platform) => (
                                <div key={platform} className="space-y-2">
                                    <Label htmlFor={platform.toLowerCase()}>
                                        {platform.charAt(0) + platform.slice(1).toLowerCase()}
                                    </Label>
                                    <Input
                                        id={platform.toLowerCase()}
                                        type="url"
                                        value={formData.socialMediaLinks?.[platform] || ""}
                                        onChange={(e) =>
                                            handleSocialLinkChange(platform, e.target.value)
                                        }
                                        placeholder={`https://${platform.toLowerCase()}.com/yourprofile`}
                                    />
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>

                {/* Custom Profile Markdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Custom Profile (Markdown)</CardTitle>
                        <CardDescription>
                            Customize your profile page with Markdown formatting
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={markdownContent}
                            onChange={(e) => setMarkdownContent(e.target.value)}
                            placeholder="# Welcome to my profile!&#10;&#10;I'm a passionate developer...&#10;&#10;## Skills&#10;- JavaScript&#10;- React&#10;- Node.js"
                            rows={10}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Supports Markdown formatting. You can use headers, lists, links, and more.
                        </p>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        disabled={updateProfileMutation.isPending || updateMarkdownMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending || updateMarkdownMutation.isPending}
                    >
                        {updateProfileMutation.isPending || updateMarkdownMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
