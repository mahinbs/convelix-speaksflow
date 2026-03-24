import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleBackToDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-background to-secondary">
      <div className="text-center space-y-6 p-8 rounded-lg bg-card border border-border shadow-lg max-w-lg">
        <h1 className="text-6xl font-bold text-brand-600">404</h1>
        <p className="text-xl text-foreground">Oops! Page not found</p>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="space-x-4">
          <Button
            onClick={handleBackToDashboard}
            className="px-6"
          >
            {user ? 'Back to Dashboard' : 'Back to Home'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
