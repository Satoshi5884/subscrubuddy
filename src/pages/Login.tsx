import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";

export default function Login() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">SubscruBuddyへようこそ</h2>
          <p className="mt-2 text-muted-foreground">
            サブスクリプション管理をもっと簡単に
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <GoogleAuthButton />
        </div>
      </div>
    </div>
  );
} 