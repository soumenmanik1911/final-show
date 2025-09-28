import { authClient } from "@/lib/auth-client";
import { GeneratedAvatar } from "@/components/genrated-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const DashboardUserButton = () => {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isPending || !data?.user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      // Show beautiful logout message
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  // Beautiful logout message overlay
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Goodbye!</h3>
          <p className="text-gray-600 mb-4">You've been successfully signed out.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Redirecting to sign in...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      {/* Container is styled as a clean black/white avatar button, matching your screenshots */}
      <DropdownMenuTrigger
        className="
          rounded-lg border border-border/10 p-3 w-full flex items-center justify-between
          bg-[#18181A]
          hover:bg-white/10
          transition-colors
          overflow-hidden
          cursor-pointer
        "
      >
        <div className="flex items-center min-w-0">
          <GeneratedAvatar 
            seed={data.user.name || data.user.email || "user"}
            variant="initials"
            size={32}
            className="border-gray-600"
          />
          <div className="ml-3 min-w-0">
            <span className="text-base text-white font-medium truncate block">
              {data.user.name || "User"}
            </span>
            {data.user.email && (
              <span className="text-xs text-gray-400 truncate block">
                {data.user.email}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200/20 shadow-xl">
        <DropdownMenuLabel className="text-gray-700 font-medium px-3 py-2">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200/30" />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50/80 
                     focus:bg-red-50/80 focus:text-red-700 transition-all duration-200
                     flex items-center gap-3 px-3 py-3 rounded-md mx-1 my-1"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              {isLoggingOut ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </span>
              <span className="text-xs text-gray-500">
                {isLoggingOut ? "See you soon!" : "End your session"}
              </span>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/*
========================================
  UPDATED FEATURES:
========================================
- Integrated GeneratedAvatar component with initials variant
- Uses username as seed for avatar generation
- Shows user email below name for better UX
- Added dropdown arrow indicator
- Maintained dark theme styling with proper hover effects
- Enhanced layout with better spacing and typography
- Dropdown functionality ready for implementation
*/
