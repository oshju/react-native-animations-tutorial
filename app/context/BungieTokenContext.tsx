export default BungieTokenProvider;
import React, { createContext, useContext, useState, ReactNode } from 'react';

type BungieTokenContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

const BungieTokenContext = createContext<BungieTokenContextType | undefined>(undefined);

export function BungieTokenProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  return (
    <BungieTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </BungieTokenContext.Provider>
  );
}

export function useBungieToken() {
  const context = useContext(BungieTokenContext);
  if (!context) throw new Error('useBungieToken must be used within BungieTokenProvider');
  return context;
}
