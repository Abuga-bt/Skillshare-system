import { MapPin, Mail, Calendar, Briefcase } from "lucide-react";
import { useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { EditableText } from "./EditableText";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  joinDate: string;
  rating: number;
  reviewCount: number;
}

export const ProfileCard = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "Alex Morgan",
    title: "Creative Designer & Developer",
    location: "San Francisco, CA",
    email: "alex@example.com",
    bio: "Passionate about creating beautiful digital experiences. I specialize in UI/UX design and front-end development, bringing ideas to life with clean code and stunning visuals.",
    joinDate: "January 2024",
    rating: 4.8,
    reviewCount: 127,
  });

  const updateProfile = (key: keyof ProfileData, value: string | number) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Card */}
      <div className="bg-card rounded-2xl card-elevated overflow-hidden animate-fade-in">
        {/* Header Gradient */}
        <div className="h-32 gradient-warm relative">
          <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
        </div>

        {/* Profile Content */}
        <div className="px-6 md:px-8 pb-8">
          {/* Avatar - overlapping header */}
          <div className="flex justify-center -mt-20 mb-6">
            <ProfileAvatar
              size="xl"
              editable
              onImageChange={(file) => console.log("Image changed:", file)}
            />
          </div>

          {/* Name & Title */}
          <div className="text-center space-y-2 mb-6">
            <EditableText
              value={profile.name}
              onSave={(value) => updateProfile("name", value)}
              placeholder="Your Name"
              variant="title"
            />
            <EditableText
              value={profile.title}
              onSave={(value) => updateProfile("title", value)}
              placeholder="Your Title"
              variant="subtitle"
            />
          </div>

          {/* Rating Section */}
          <div
            className={cn(
              "flex items-center justify-center gap-3 py-4 mb-6",
              "border-y border-border"
            )}
          >
            <StarRating rating={profile.rating} size="lg" />
            <span className="text-muted-foreground text-sm">
              ({profile.reviewCount} reviews)
            </span>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <MetaItem
              icon={MapPin}
              label="Location"
              value={profile.location}
              onEdit={(value) => updateProfile("location", value)}
            />
            <MetaItem
              icon={Mail}
              label="Email"
              value={profile.email}
              onEdit={(value) => updateProfile("email", value)}
            />
            <MetaItem
              icon={Briefcase}
              label="Title"
              value={profile.title}
              onEdit={(value) => updateProfile("title", value)}
            />
            <MetaItem
              icon={Calendar}
              label="Member since"
              value={profile.joinDate}
              editable={false}
            />
          </div>

          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              About
            </h3>
            <EditableText
              value={profile.bio}
              onSave={(value) => updateProfile("bio", value)}
              placeholder="Write something about yourself..."
              variant="body"
              multiline
              maxLength={500}
            />
          </div>
        </div>
      </div>

      {/* Rating Update Card */}
      <div
        className="mt-6 bg-card rounded-2xl card-elevated p-6 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Update Your Rating
        </h3>
        <div className="flex items-center justify-between">
          <StarRating
            rating={profile.rating}
            size="lg"
            interactive
            onRatingChange={(rating) => updateProfile("rating", rating)}
            showValue={false}
          />
          <span className="text-2xl font-display font-bold text-gradient">
            {profile.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

interface MetaItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onEdit?: (value: string) => void;
  editable?: boolean;
}

const MetaItem = ({
  icon: Icon,
  label,
  value,
  onEdit,
  editable = true,
}: MetaItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onEdit?.(editValue);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        "bg-secondary/30 transition-colors duration-200",
        editable && "hover:bg-secondary/50 cursor-pointer group"
      )}
      onClick={() => editable && setIsEditing(true)}
    >
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-foreground"
          />
        ) : (
          <p className="text-sm font-medium text-foreground truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );
};
