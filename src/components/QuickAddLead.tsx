import { useState } from 'react';
import { Lead } from '../App';
import { X, Zap } from 'lucide-react';

interface QuickAddLeadProps {
  onClose: () => void;
  onAdd: (lead: Partial<Lead>) => void;
}

export function QuickAddLead({ onClose, onAdd }: QuickAddLeadProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    propertyType: '',
    budget: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">Adicionar Lead Rápido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Nome do Lead *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Ex: João Silva"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-gray-700 mb-1">
              Telefone/WhatsApp *
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="(11) 98765-4321"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="propertyType" className="block text-gray-700 mb-1">
                Tipo de Imóvel *
              </label>
              <input
                type="text"
                id="propertyType"
                name="propertyType"
                required
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Apt 3 quartos"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-gray-700 mb-1">
                Orçamento *
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                required
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="R$ 500k"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-gray-700 mb-1">
              Observações (opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Qualquer informação relevante..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Adicionar Lead
            </button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm">
              💡 <span>O lead será automaticamente classificado como</span> <span className="text-blue-900">Quente</span> <span>e adicionado à etapa</span> <span className="text-blue-900">Primeiro Contato</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
