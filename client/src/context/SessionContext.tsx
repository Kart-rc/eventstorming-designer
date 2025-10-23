import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { BusinessRequirement, DomainEvent, Command, Aggregate, BoundedContext, CostTracking } from '@shared/types';

interface SessionContextType {
  sessionId: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  businessRequirement: BusinessRequirement | null;
  setBusinessRequirement: (req: BusinessRequirement) => void;
  domainEvents: DomainEvent[];
  setDomainEvents: (events: DomainEvent[]) => void;
  commands: Command[];
  setCommands: (commands: Command[]) => void;
  aggregates: Aggregate[];
  setAggregates: (aggregates: Aggregate[]) => void;
  boundedContexts: BoundedContext[];
  setBoundedContexts: (contexts: BoundedContext[]) => void;
  prdContent: string;
  setPrdContent: (content: string) => void;
  apiDesign: any;
  setApiDesign: (design: any) => void;
  costTracking: CostTracking;
  addCost: (step: string, tokensUsed: number, cost: number) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessionId] = useState(uuidv4());
  const [currentStep, setCurrentStep] = useState(0);
  const [businessRequirement, setBusinessRequirement] = useState<BusinessRequirement | null>(null);
  const [domainEvents, setDomainEvents] = useState<DomainEvent[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [aggregates, setAggregates] = useState<Aggregate[]>([]);
  const [boundedContexts, setBoundedContexts] = useState<BoundedContext[]>([]);
  const [prdContent, setPrdContent] = useState('');
  const [apiDesign, setApiDesign] = useState<any>(null);
  const [costTracking, setCostTracking] = useState<CostTracking>({
    sessionId,
    totalTokensUsed: 0,
    totalCost: 0,
    breakdown: []
  });

  const addCost = (step: string, tokensUsed: number, cost: number) => {
    setCostTracking(prev => ({
      ...prev,
      totalTokensUsed: prev.totalTokensUsed + tokensUsed,
      totalCost: prev.totalCost + cost,
      breakdown: [
        ...prev.breakdown,
        {
          step,
          tokensUsed,
          cost,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  const resetSession = () => {
    setCurrentStep(0);
    setBusinessRequirement(null);
    setDomainEvents([]);
    setCommands([]);
    setAggregates([]);
    setBoundedContexts([]);
    setPrdContent('');
    setApiDesign(null);
    setCostTracking({
      sessionId,
      totalTokensUsed: 0,
      totalCost: 0,
      breakdown: []
    });
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        currentStep,
        setCurrentStep,
        businessRequirement,
        setBusinessRequirement,
        domainEvents,
        setDomainEvents,
        commands,
        setCommands,
        aggregates,
        setAggregates,
        boundedContexts,
        setBoundedContexts,
        prdContent,
        setPrdContent,
        apiDesign,
        setApiDesign,
        costTracking,
        addCost,
        resetSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
