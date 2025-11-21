import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { Loader2, Mail, Globe, Edit, Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import { Badge } from "~/components/ui/badge";
import { profileApi } from "~/api/profile";
import { useAuth } from "~/hooks/useAuth";
import ReactMarkdown from "react-markdown";

export function meta({ params }: { params: { username: string } }) {
    return [
        { title: `${params.username}'s Profile - Blog Platform` },
        { name: "description", content: `View ${params.username}'s profile` },
    ];
}

const socialIcons: Record<string, any> = {
    GITHUB: Github,
    TWITTER: Twitter,
    LINKEDIN: Linkedin,
    FACEBOOK: Facebook,
    INSTAGRAM: Instagram,
};

export default function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const { user: currentUser } = useAuth();

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile", username],
        queryFn: () => profileApi.getProfileByUsername(username!),
        enabled: !!username,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    The user you're looking for doesn't exist.
                </p>
                <Button asChild>
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        );
    }

    const isOwnProfile = currentUser?.username === profile.username;

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4">
            {/* Profile Header */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar */}
                        <Avatar className="h-32 w-32 border-4 border-border">
                            <AvatarImage src={profile.avatar} alt={profile.username} />
                            <AvatarFallback className="text-4xl">
                                {profile.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1">{profile.username}</h1>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {profile.roles.map((role) => (
                                            <Badge key={role} variant="secondary">
                                                {role.replace("ROLE_", "")}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {isOwnProfile && (
                                    <Button asChild size="sm">
                                        <Link to="/profile/edit">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {profile.bio && (
                                <p className="text-muted-foreground mb-4">{profile.bio}</p>
                            )}

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {profile.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile.email}</span>
                                    </div>
                                )}
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span>Website</span>
                                    </a>
                                )}
                            </div>

                            {/* Social Links */}
                            {profile.socialMediaLinks && Object.keys(profile.socialMediaLinks).length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {Object.entries(profile.socialMediaLinks).map(([platform, url]) => {
                                        if (!url) return null;
                                        const Icon = socialIcons[platform];
                                        return (
                                            <a
                                                key={platform}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors text-sm"
                                            >
                                                {Icon && <Icon className="w-4 h-4" />}
                                                <span>{platform.charAt(0) + platform.slice(1).toLowerCase()}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Posts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{profile.postsCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Comments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{profile.commentsCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Saved Posts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{profile.savedPostsCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Custom Profile Markdown */}
            {profile.customProfileMarkdown && (
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{profile.customProfileMarkdown}</ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Custom Information */}
            {profile.customInformation && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {profile.customInformation}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
