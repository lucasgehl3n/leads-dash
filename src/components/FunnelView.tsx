import { Lead } from '../App';
import { Phone, MessageCircle, CheckCircle, ChevronRight } from 'lucide-react';

interface FunnelViewProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

export function FunnelView({ leads, onUpdateLead }: FunnelViewProps) {
  const stages = [
    { id: 'primeiro-contato', label: 'Primeiro Contato', color: 'blue' },
    { id: 'interesse', label: 'Demonstrou Interesse', color: 'purple' },
    { id: 'negociacao', label: 'Em Negociação', color: 'orange' },
    { id: 'fechamento', label: 'Pronto para Fechar', color: 'green' },
  ] as const;

  const getLeadsByStage = (stage: Lead['stage']) => {
    return leads.filter(l => l.stage === stage)
      .sort((a, b) => b.conversionProbability - a.conversionProbability);
  };

  const handleAdvance = (lead: Lead) => {
    const stageOrder: Lead['stage'][] = ['primeiro-contato', 'interesse', 'negociacao', 'fechamento'];
    const currentIndex = stageOrder.indexOf(lead.stage);
    if (currentIndex < stageOrder.length - 1) {
      onUpdateLead(lead.id, {
        stage: stageOrder[currentIndex + 1],
        daysInStage: 0,
        temperature: 'quente',
      });
    }
  };

  const getTotalValue = (stageLeads: Lead[]) => {
    const total = stageLeads.reduce((sum, lead) => {
      const value = parseFloat(lead.budget.replace(/[^\d]/g, '')) / 1000;
      return sum + value;
    }, 0);
    return Math.round(total);
  };

  return (
    <div className="space-y-6">
      {/* Visão Geral do Funil */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-gray-900 mb-6">Visão Geral do Funil</h2>
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => {
            const stageLeads = getLeadsByStage(stage.id as Lead['stage']);
            const totalValue = getTotalValue(stageLeads);
            const percentage = Math.round((stageLeads.length / leads.length) * 100);

            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex-1">
                  <div className={`bg-${stage.color}-50 border-2 border-${stage.color}-200 rounded-lg p-4`}>
                    <div className="text-center">
                      <div className={`text-${stage.color}-700`}>{stage.label}</div>
                      <div className="text-gray-900 mt-2">{stageLeads.length}</div>
                      <div className="text-gray-500 text-sm">leads</div>
                      <div className={`text-${stage.color}-600 text-sm mt-2`}>
                        R$ {totalValue}k
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {percentage}% do total
                      </div>
                    </div>
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <ChevronRight className="w-8 h-8 text-gray-300 mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhes por Etapa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id as Lead['stage']);
          
          return (
            <div
              key={stage.id}
              className={`bg-white rounded-xl p-6 shadow-md border-2 border-${stage.color}-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">{stage.label}</h3>
                <span className={`px-3 py-1 bg-${stage.color}-100 text-${stage.color}-700 rounded-full`}>
                  {stageLeads.length} leads
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>Nenhum lead nesta etapa</p>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`bg-${stage.color}-50 rounded-lg p-4 border border-${stage.color}-100 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-900">{lead.name}</h4>
                            {lead.temperature === 'quente' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                                🔥 Quente
                              </span>
                            )}
                            {lead.daysInStage > 7 && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                                ⚠️ {lead.daysInStage}d
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{lead.propertyType}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900">{lead.conversionProbability}%</div>
                          <div className="text-gray-500 text-xs">chance</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>{lead.budget}</span>
                        <span>•</span>
                        <span>{lead.contact}</span>
                      </div>

                      <div className="bg-white rounded p-2 mb-3 border border-gray-200">
                        <p className="text-gray-700 text-sm">
                          📋 {lead.nextAction}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateLead(lead.id, { temperature: 'quente' })}
                          className={`flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm`}
                        >
                          <Phone className="w-3 h-3" />
                          Ligar
                        </button>
                        <button
                          onClick={() => onUpdateLead(lead.id, { temperature: 'quente' })}
                          className={`flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          Msg
                        </button>
                        <div className="flex-1" />
                        {stage.id !== 'fechamento' && (
                          <button
                            onClick={() => handleAdvance(lead)}
                            className={`flex items-center gap-1 px-3 py-1.5 bg-${stage.color}-600 text-white rounded hover:bg-${stage.color}-700 transition-colors text-sm`}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Avançar
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
