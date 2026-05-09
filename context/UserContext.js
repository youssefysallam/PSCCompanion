import React, { createContext, useContext, useState } from 'react';
import { USER_PROFILE } from '../constants/mockData';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userStatus, setUserStatus] = useState(USER_PROFILE.status);
  return (
    <UserContext.Provider value={{ userStatus, setUserStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
