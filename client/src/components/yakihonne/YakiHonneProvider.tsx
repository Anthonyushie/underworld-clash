import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import SWHandler from 'smart-widget-handler';

interface YakiHonneUser {
  pubkey: string;
  display_name?: string;
  name?: string;
  picture?: string;
  banner?: string;
  nip05?: string;
  lud16?: string;
  lud06?: string;
  website?: string;
  hasWallet?: boolean;
}

interface YakiHonneContextType {
  user: YakiHonneUser | null;
  isReady: boolean;
  signEvent: (eventDraft: any) => void;
  publishEvent: (eventDraft: any) => void;
  requestPayment: (paymentRequest: any) => void;
  sendCustomData: (data: any) => void;
}

const YakiHonneContext = createContext<YakiHonneContextType | undefined>(undefined);

interface YakiHonneProviderProps {
  children: ReactNode;
}

export function YakiHonneProvider({ children }: YakiHonneProviderProps) {
  const [user, setUser] = useState<YakiHonneUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Notify parent that the widget is ready
    SWHandler.client.ready();

    // Set up listener for parent messages
    const listener = SWHandler.client.listen((data) => {
      console.log('Received message from YakiHonne:', data);

      if (data.kind === 'user-metadata') {
        setUser(data.data.user);
        setIsReady(true);
      } else if (data.kind === 'nostr-event') {
        // Handle signed/published events
        console.log('Event processed:', data.data);
      } else if (data.kind === 'custom-data') {
        // Handle custom data responses
        console.log('Custom data response:', data.data);
      } else if (data.kind === 'err-msg') {
        console.error('YakiHonne error:', data.data);
      }
    });

    // Clean up listener on component unmount
    return () => listener.close();
  }, []);

  const signEvent = (eventDraft: any) => {
    SWHandler.client.requestEventSign(
      eventDraft,
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const publishEvent = (eventDraft: any) => {
    SWHandler.client.requestEventPublish(
      eventDraft,
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const requestPayment = (paymentRequest: any) => {
    SWHandler.client.requestPayment(
      paymentRequest,
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const sendCustomData = (data: any) => {
    SWHandler.client.sendContext(
      JSON.stringify(data),
      window.location.ancestorOrigins?.[0] || '*'
    );
  };

  const contextValue: YakiHonneContextType = {
    user,
    isReady,
    signEvent,
    publishEvent,
    requestPayment,
    sendCustomData,
  };

  return (
    <YakiHonneContext.Provider value={contextValue}>
      {children}
    </YakiHonneContext.Provider>
  );
}

export function useYakiHonne() {
  const context = useContext(YakiHonneContext);
  if (context === undefined) {
    throw new Error('useYakiHonne must be used within a YakiHonneProvider');
  }
  return context;
}