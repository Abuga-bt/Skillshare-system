import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onImageChange?: (file: File) => void;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
};

export const ProfileAvatar = ({
  src,
  alt = "Profile photo",
  size = "lg",
  editable = false,
  onImageChange,
}: ProfileAvatarProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(src);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange?.(file);
    }
  };

  return (
    <div className="relative group">
      <div className="avatar-ring">
        <div
          className={cn(
            sizeClasses[size],
            "rounded-full overflow-hidden bg-secondary flex items-center justify-center",
            editable && "cursor-pointer"
          )}
          onClick={handleClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <span className="text-3xl font-display text-muted-foreground">
                ?
              </span>
            </div>
          )}
        </div>
      </div>

      {editable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleClick}
            className={cn(
              "absolute bottom-0 right-0 p-2 rounded-full",
              "bg-primary text-primary-foreground",
              "shadow-lg transition-all duration-200",
              "hover:scale-110 hover:shadow-xl",
              "opacity-0 group-hover:opacity-100"
            )}
          >
            <Camera className={iconSizeClasses[size]} />
          </button>
        </>
      )}
    </div>
  );
};
