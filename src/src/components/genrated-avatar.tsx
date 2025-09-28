import {createAvatar} from "@dicebear/core";
import {botttsNeutral, initials} from "@dicebear/collection";
import {cn} from "@/lib/utils";

// Utility function to safely encode SVG to base64
function svgToBase64(svg: string): string {
  try {
    // Convert SVG string to UTF-8 bytes and then to base64
    const utf8Bytes = new TextEncoder().encode(svg);
    const binaryString = String.fromCharCode(...utf8Bytes);
    return btoa(binaryString);
  } catch (error) {
    // Fallback for older browsers
    try {
      return btoa(unescape(encodeURIComponent(svg)));
    } catch (fallbackError) {
      console.error("Failed to encode SVG to base64:", fallbackError);
      return "";
    }
  }
}

interface GeneratedAvatarProps {
  seed: string;
  variant?: "botttsNeutral" | "initials";
  size?: number;
  className?: string;
}

export function GeneratedAvatar({ 
  seed, 
  variant = "initials", 
  size = 40, 
  className 
}: GeneratedAvatarProps) {
  const avatar = createAvatar(variant === "initials" ? initials : botttsNeutral, {
    seed,
    size,
    backgroundColor: ["#1f2937", "#374151", "#4b5563"],
  });

  const svg = avatar.toString();
  
  // Convert SVG to base64
  const base64 = svgToBase64(svg);
  const dataUrl = base64 ? `data:image/svg+xml;base64,${base64}` : '';

  return (
    <img
      src={dataUrl}
      alt={`Avatar for ${seed}`}
      width={size}
      height={size}
      className={cn("rounded-full border-2 border-gray-700", className)}
      onError={(e) => {
        // Fallback to a simple colored circle if image fails to load
        const fallbackSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 1}" fill="#374151" stroke="#6B7280" stroke-width="1"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="#ffffff">
            ${seed.charAt(0).toUpperCase() || 'U'}
          </text>
        </svg>`;
        const base64 = svgToBase64(fallbackSvg);
        e.currentTarget.src = base64 ? `data:image/svg+xml;base64,${base64}` : '';
      }}
    />
  );
}
