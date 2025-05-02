import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../constants/User";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: (updatedUser: User) => void;
  clearUser: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    // Here you could also make an API call to update the user on the server
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, updateUser, clearUser, isLoading, setIsLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
