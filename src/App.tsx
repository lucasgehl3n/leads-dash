import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { PriorityList } from './components/PriorityList';
import { FunnelView } from './components/FunnelView';
import { QuickAddLead } from './components/QuickAddLead';
import { LayoutDashboard, List, Filter } from 'lucide-react';

export interface Lead {
  id: string;
  name: string;
  contact: string;
  propertyType: string;
  budget: string;
  stage: 'primeiro-contato' | 'interesse' | 'negociacao' | 'fechamento';
  lastInteraction: Date;
  nextAction: string;
  daysInStage: number;
  conversionProbability: number;
  notes?: string;
}

// Sistema automático de temperatura baseado em tempo
export function calculateTemperature(lastInteraction: Date): 'quente' | 'morno' | 'frio' {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays <= 2) return 'quente';
  if (diffInDays <= 5) return 'morno';
  return 'frio';
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    contact: '(11) 98765-4321',
    propertyType: 'Apartamento 3 quartos',
    budget: 'R$ 800k',
    stage: 'primeiro-contato',
    lastInteraction: new Date('2025-12-10'),
    nextAction: 'Retornar ligação hoje às 15h',
    daysInStage: 0,
    conversionProbability: 75,
    notes: 'Muito interessado, pediu mais fotos'
  },
  {
    id: '2',
    name: 'Maria Santos',
    contact: '(11) 97654-3210',
    propertyType: 'Casa em condomínio',
    budget: 'R$ 1.2M',
    stage: 'interesse',
    lastInteraction: new Date('2025-12-09'),
    nextAction: 'Confirmar visita amanhã 14h',
    daysInStage: 3,
    conversionProbability: 85,
    notes: 'Quer ver 3 opções no mesmo dia'
  },
  {
    id: '3',
    name: 'João Oliveira',
    contact: '(11) 96543-2109',
    propertyType: 'Apartamento 2 quartos',
    budget: 'R$ 600k',
    stage: 'negociacao',
    lastInteraction: new Date('2025-12-05'),
    nextAction: 'URGENTE: Sem contato há 5 dias',
    daysInStage: 8,
    conversionProbability: 45,
    notes: 'Está comparando com outro imóvel'
  },
  {
    id: '4',
    name: 'Ana Paula Costa',
    contact: '(11) 95432-1098',
    propertyType: 'Cobertura',
    budget: 'R$ 1.5M',
    stage: 'fechamento',
    lastInteraction: new Date('2025-12-09'),
    nextAction: 'Enviar contrato para assinatura',
    daysInStage: 2,
    conversionProbability: 90,
    notes: 'Aprovação de crédito confirmada'
  },
  {
    id: '5',
    name: 'Roberto Mendes',
    contact: '(11) 94321-0987',
    propertyType: 'Apartamento 4 quartos',
    budget: 'R$ 950k',
    stage: 'interesse',
    lastInteraction: new Date('2025-11-28'),
    nextAction: 'ATENÇÃO: Reativar lead',
    daysInStage: 12,
    conversionProbability: 20,
    notes: 'Não respondeu últimas 3 mensagens'
  },
  {
    id: '6',
    name: 'Patricia Lima',
    contact: '(11) 93210-9876',
    propertyType: 'Apartamento 3 quartos',
    budget: 'R$ 750k',
    stage: 'negociacao',
    lastInteraction: new Date('2025-12-10'),
    nextAction: 'Responder contraproposta',
    daysInStage: 5,
    conversionProbability: 70,
    notes: 'Ofereceu R$ 720k'
  },
  {
    id: '7',
    name: 'Fernando Costa',
    contact: '(11) 92109-8765',
    propertyType: 'Studio',
    budget: 'R$ 400k',
    stage: 'primeiro-contato',
    lastInteraction: new Date('2025-12-08'),
    nextAction: 'Enviar opções de imóveis',
    daysInStage: 2,
    conversionProbability: 55,
    notes: 'Interessado em opções de imóveis'
  },
  {
    id: '8',
    name: 'Juliana Alves',
    contact: '(11) 91098-7654',
    propertyType: 'Casa térrea',
    budget: 'R$ 900k',
    stage: 'interesse',
    lastInteraction: new Date('2025-12-10'),
    nextAction: 'Preparar documentação',
    daysInStage: 1,
    conversionProbability: 80,
    notes: 'Gostou muito da última visita'
  },
];

export default function App() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [view, setView] = useState<'dashboard' | 'priority' | 'funnel'>('dashboard');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleQuickAdd = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: leadData.name || '',
      contact: leadData.contact || '',
      propertyType: leadData.propertyType || '',
      budget: leadData.budget || '',
      stage: 'primeiro-contato',
      lastInteraction: new Date(),
      nextAction: 'Fazer primeiro contato',
      daysInStage: 0,
      conversionProbability: 60,
      notes: leadData.notes
    };
    setLeads([newLead, ...leads]);
    setShowQuickAdd(false);
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, ...updates, lastInteraction: new Date() }
        : lead
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Assistente de Vendas</h1>
              <p className="text-gray-600 mt-1">
                Foque no que importa, deixe a organização conosco
              </p>
            </div>
            <button
              onClick={() => setShowQuickAdd(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              + Novo Lead
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'dashboard'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral
            </button>
            <button
              onClick={() => setView('priority')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'priority'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              Minhas Prioridades
            </button>
            <button
              onClick={() => setView('funnel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === 'funnel'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              Funil de Vendas
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && <Dashboard leads={leads} />}
        {view === 'priority' && (
          <PriorityList leads={leads} onUpdateLead={handleUpdateLead} />
        )}
        {view === 'funnel' && (
          <FunnelView leads={leads} onUpdateLead={handleUpdateLead} />
        )}
      </main>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddLead
          onClose={() => setShowQuickAdd(false)}
          onAdd={handleQuickAdd}
        />
      )}
    </div>
  );
}