import React, { createContext, useContext, useState } from "react";

type User = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
};

type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
