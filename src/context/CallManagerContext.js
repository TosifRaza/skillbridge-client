import { createContext, useContext } from 'react';

export const CallContext = createContext(null);

export const useCallManager = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCallManager must be used within CallManagerProvider');
  return context;
};
