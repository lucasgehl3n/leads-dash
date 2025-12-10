import { useState } from 'react';
import { Lead, calculateTemperature } from '../App';
import { Flame, Droplet, Snowflake, Phone, MessageCircle, Calendar, CheckCircle, ChevronRight, Clock, ExternalLink } from 'lucide-react';

interface PriorityListProps {
  leads: Lead[];
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
}

export function PriorityList({ leads, onUpdateLead }: PriorityListProps) {
  const [filter, setFilter] = useState<'all' | 'quente' | 'morno' | 'frio'>('all');

  // Calcular temperatura automática para cada lead baseado em tempo
  const leadsWithTemperature = leads.map(lead => ({
    ...lead,
    temperature: calculateTemperature(lead.lastInteraction)
  }));

  // Ordenar leads por prioridade inteligente
  const sortedLeads = [...leadsWithTemperature].sort((a, b) => {
    // Prioridade 1: Leads frios ou com muito tempo no estágio (precisam atenção urgente)
    const aUrgent = a.temperature === 'frio' || a.daysInStage > 7;
    const bUrgent = b.temperature === 'frio' || b.daysInStage > 7;
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;

    // Prioridade 2: Leads quentes com alta probabilidade de conversão
    if (a.temperature === 'quente' && b.temperature !== 'quente') return -1;
    if (a.temperature !== 'quente' && b.temperature === 'quente') return 1;

    // Prioridade 3: Probabilidade de conversão
    return b.conversionProbability - a.conversionProbability;
  });

  const filteredLeads = filter === 'all' 
    ? sortedLeads 
    : sortedLeads.filter(l => l.temperature === filter);

  const getTemperatureIcon = (temp: 'quente' | 'morno' | 'frio') => {
    switch (temp) {
      case 'quente':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'morno':
        return <Droplet className="w-4 h-4 text-orange-500" />;
      case 'frio':
        return <Snowflake className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTemperatureColor = (temp: 'quente' | 'morno' | 'frio') => {
    switch (temp) {
      case 'quente':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'morno':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'frio':
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStageLabel = (stage: Lead['stage']) => {
    switch (stage) {
      case 'primeiro-contato':
        return 'Primeiro Contato';
      case 'interesse':
        return 'Interesse';
      case 'negociacao':
        return 'Negociação';
      case 'fechamento':
        return 'Fechamento';
    }
  };

  const getDaysSinceLastInteraction = (lastInteraction: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const handleQuickAction = (lead: Lead, action: 'call' | 'whatsapp' | 'advance') => {
    if (action === 'advance') {
      const stages: Lead['stage'][] = ['primeiro-contato', 'interesse', 'negociacao', 'fechamento'];
      const currentIndex = stages.indexOf(lead.stage);
      if (currentIndex < stages.length - 1) {
        onUpdateLead(lead.id, {
          stage: stages[currentIndex + 1],
          daysInStage: 0,
        });
      }
    } else if (action === 'call') {
      // Abre o discador do telefone
      window.location.href = `tel:${lead.contact}`;
      // Atualiza última interação
      onUpdateLead(lead.id, { lastInteraction: new Date() });
    } else if (action === 'whatsapp') {
      // Abre WhatsApp Web
      const phoneNumber = lead.contact.replace(/\D/g, '');
      window.open(`https://wa.me/55${phoneNumber}`, '_blank');
      // Atualiza última interação
      onUpdateLead(lead.id, { lastInteraction: new Date() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Explicação do Sistema Automático */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Sistema Automático de Priorização</h3>
            <p className="text-gray-600 text-sm mt-1">
              🔥 <span className="text-green-700">Quente</span>: contato nos últimos 2 dias  •  
              💧 <span className="text-orange-600"> Morno</span>: 3-5 dias sem contato  •  
              ❄️ <span className="text-blue-600"> Frio</span>: mais de 5 dias parado
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Você não precisa atualizar nada manualmente. Apenas clique nos botões de ação e o sistema atualiza automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({leadsWithTemperature.length})
          </button>
          <button
            onClick={() => setFilter('quente')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'quente'
                ? 'bg-red-500 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <Flame className="w-4 h-4" />
            Quentes ({leadsWithTemperature.filter(l => l.temperature === 'quente').length})
          </button>
          <button
            onClick={() => setFilter('morno')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'morno'
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <Droplet className="w-4 h-4" />
            Mornos ({leadsWithTemperature.filter(l => l.temperature === 'morno').length})
          </button>
          <button
            onClick={() => setFilter('frio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              filter === 'frio'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Snowflake className="w-4 h-4" />
            Frios ({leadsWithTemperature.filter(l => l.temperature === 'frio').length})
          </button>
        </div>
      </div>

      {/* Lista de Leads Priorizada */}
      <div className="space-y-3">
        {filteredLeads.map((lead, index) => {
          const isUrgent = lead.temperature === 'frio' || lead.daysInStage > 7;
          const daysSince = getDaysSinceLastInteraction(lead.lastInteraction);
          
          return (
            <div
              key={lead.id}
              className={`bg-white rounded-xl p-5 shadow-md border-2 transition-all hover:shadow-lg ${
                isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Número de prioridade */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index === 0 ? 'bg-red-500 text-white' :
                    index === 1 ? 'bg-orange-500 text-white' :
                    index === 2 ? 'bg-yellow-500 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{lead.name}</h3>
                      {getTemperatureIcon(lead.temperature)}
                      {isUrgent && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-sm">
                          URGENTE
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{lead.nextAction}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>{lead.contact}</span>
                      <span>•</span>
                      <span>{lead.propertyType}</span>
                      <span>•</span>
                      <span>{lead.budget}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded ${getTemperatureColor(lead.temperature)}`}>
                        {getStageLabel(lead.stage)}
                      </span>
                    </div>

                    {lead.notes && (
                      <p className="text-gray-500 text-sm mt-2 italic">
                        💡 {lead.notes}
                      </p>
                    )}

                    {/* Info de tempo automática */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {daysSince === 0 ? (
                          <span className="text-green-600">Contato hoje</span>
                        ) : daysSince === 1 ? (
                          <span className="text-green-600">Último contato ontem</span>
                        ) : daysSince <= 2 ? (
                          <span className="text-green-600">Há {daysSince} dias (🔥 Quente)</span>
                        ) : daysSince <= 5 ? (
                          <span className="text-orange-600">Há {daysSince} dias (💧 Esfriando)</span>
                        ) : (
                          <span className="text-red-600">Há {daysSince} dias (❄️ Frio - Reaquecer!)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Probabilidade de conversão */}
                <div className="text-right ml-4">
                  <div className="text-gray-900 mb-1">{lead.conversionProbability}%</div>
                  <div className="text-gray-500 text-sm">chance</div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lead.conversionProbability >= 70 ? 'bg-green-500' :
                        lead.conversionProbability >= 40 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${lead.conversionProbability}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ações Rápidas - Diretas, sem check-in */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleQuickAction(lead, 'call')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Ligar Agora
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleQuickAction(lead, 'whatsapp')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp
                  <ExternalLink className="w-3 h-3" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => handleQuickAction(lead, 'advance')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Avançar Etapa
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
