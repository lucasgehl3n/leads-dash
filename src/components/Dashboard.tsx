import { Lead } from '../App';
import { TrendingUp, AlertCircle, Target, DollarSign, Clock, Zap, CheckCircle } from 'lucide-react';
import { calculateTemperature } from '../App';

interface DashboardProps {
  leads: Lead[];
}

export function Dashboard({ leads }: DashboardProps) {
  // Calcular temperatura automática
  const leadsWithTemperature = leads.map(lead => ({
    ...lead,
    temperature: calculateTemperature(lead.lastInteraction)
  }));

  // Métricas calculadas
  const totalLeads = leadsWithTemperature.length;
  const hotLeads = leadsWithTemperature.filter(l => l.temperature === 'quente').length;
  const needsAttention = leadsWithTemperature.filter(l => l.temperature === 'frio' || l.daysInStage > 7).length;
  const closingLeads = leadsWithTemperature.filter(l => l.stage === 'fechamento').length;
  
  const avgConversion = Math.round(
    leads.reduce((sum, l) => sum + l.conversionProbability, 0) / leads.length
  );

  const totalBudget = leads.reduce((sum, lead) => {
    const value = parseFloat(lead.budget.replace(/[^\d]/g, '')) / 1000;
    return sum + value;
  }, 0);

  const potentialRevenue = Math.round(totalBudget * (avgConversion / 100) * 0.03); // 3% comissão

  // Leads por estágio
  const stageStats = {
    'primeiro-contato': leads.filter(l => l.stage === 'primeiro-contato').length,
    'interesse': leads.filter(l => l.stage === 'interesse').length,
    'negociacao': leads.filter(l => l.stage === 'negociacao').length,
    'fechamento': leads.filter(l => l.stage === 'fechamento').length,
  };

  // Taxa de conversão simulada
  const conversionRate = Math.round((stageStats.fechamento / totalLeads) * 100);

  // Ações urgentes
  const urgentActions = leadsWithTemperature
    .filter(l => l.temperature === 'frio' || l.daysInStage > 7 || l.nextAction.includes('URGENTE'))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Leads Ativos</span>
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-gray-900 mt-1">{totalLeads}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-600 text-sm">
              {hotLeads} quentes
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Taxa de Conversão</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-gray-900 mt-1">{avgConversion}%</div>
          <div className="text-gray-500 text-sm mt-2">
            Média do pipeline
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Comissão Potencial</span>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-gray-900 mt-1">R$ {potentialRevenue}k</div>
          <div className="text-gray-500 text-sm mt-2">
            Baseado no pipeline
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Precisa Atenção</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-gray-900 mt-1">{needsAttention}</div>
          <div className="text-orange-600 text-sm mt-2">
            Ação necessária hoje
          </div>
        </div>
      </div>

      {/* Ações Urgentes */}
      {urgentActions.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-orange-600" />
            <h2 className="text-gray-900">Ações Urgentes - Fazer Agora!</h2>
          </div>
          <div className="space-y-3">
            {urgentActions.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-gray-900">{lead.name}</h3>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-sm">
                        {lead.daysInStage > 7 ? `${lead.daysInStage} dias sem ação` : 'Urgente'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{lead.nextAction}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{lead.propertyType}</span>
                      <span>•</span>
                      <span>{lead.contact}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">{lead.conversionProbability}%</div>
                    <div className="text-gray-500 text-sm">chance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funil Visual Simplificado */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-gray-900 mb-6">Visão do Funil</h2>
        <div className="space-y-4">
          {Object.entries({
            'primeiro-contato': { label: 'Primeiro Contato', color: 'blue' },
            'interesse': { label: 'Demonstrou Interesse', color: 'purple' },
            'negociacao': { label: 'Em Negociação', color: 'orange' },
            'fechamento': { label: 'Pronto para Fechar', color: 'green' },
          }).map(([stage, config]) => {
            const count = stageStats[stage as keyof typeof stageStats];
            const percentage = Math.round((count / totalLeads) * 100);
            
            return (
              <div key={stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">{config.label}</span>
                  <span className="text-gray-900">
                    {count} leads ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`bg-${config.color}-500 h-full rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights Automáticos */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-gray-900">Insights para Melhorar sua Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Tempo Médio por Etapa</span>
            </div>
            <p className="text-gray-600 text-sm">
              Seus leads passam em média <span className="text-blue-600">4 dias</span> em cada etapa. 
              Tente acelerar o processo com follow-ups mais frequentes.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Oportunidade de Melhoria</span>
            </div>
            <p className="text-gray-600 text-sm">
              Você tem <span className="text-green-600">{closingLeads} leads</span> prontos para fechar. 
              Priorize esses contatos para aumentar sua taxa de conversão!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}