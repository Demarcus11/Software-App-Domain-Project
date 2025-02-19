import { useState, useEffect } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  passwordExpiresAt: string;
  profilePictureUrl: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Not authorized");
        }

        const userData = await response.json();
        setUser({
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          isActive: userData.isActive,
          passwordExpiresAt: userData.passwordExpiresAt,
          profilePictureUrl: userData.profilePictureUrl,
        });
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Failed to fetch user")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error };
};
