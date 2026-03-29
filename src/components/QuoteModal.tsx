'use client';

import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useApi } from '@/hooks/useApi';

interface SubService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'fixed' | 'hourly';
  estimatedHours?: number;
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: {[key: string]: SubService[]};
  totalPrice: number;
}

export default function QuoteModal({ isOpen, onClose, selectedServices, totalPrice }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const { showSuccess, showError } = useNotifications();
  const { execute: createQuote, loading: isSubmitting } = useApi();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Préparer les données pour l'API
      const selectedServicesList = getSelectedServicesList();
      
      const quoteData = {
        clientName: formData.name.trim(),
        clientEmail: formData.email.trim(),
        clientPhone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        selectedServices: selectedServicesList.map(service => ({
          serviceId: 'web-dev', // Service principal (à adapter selon vos services)
          subServiceId: service.id,
          name: service.name,
          price: service.price,
          type: service.type,
          hours: service.estimatedHours || undefined
        })),
        totalPrice: totalPrice,
        message: formData.message.trim() || undefined
      };

      // Envoyer le devis via l'API
      await createQuote(async () => {
        const { apiClient } = await import('@/lib/api');
        return apiClient.createQuote(quoteData);
      });
      
      // Succès
      showSuccess(
        'Devis demandé !',
        'Votre demande de devis a été envoyée. Je vous recontacterai dans les plus brefs délais avec une proposition détaillée.'
      );
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      });
      
      // Fermer le modal
      onClose();
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      showError(
        'Erreur d\'envoi',
        'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.'
      );
    }
  };

  const getSelectedServicesList = () => {
    return Object.values(selectedServices).flat();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Demande de devis</h2>
              <p className="text-gray-600">Remplissez vos informations pour recevoir votre devis personnalisé</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex">
            {/* Services Summary */}
            <div className="w-1/2 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services sélectionnés</h3>
              <div className="space-y-3 mb-6">
                {getSelectedServicesList().map((service) => (
                  <div key={service.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {service.type === 'fixed' 
                          ? `${service.price.toLocaleString()}€`
                          : `${(service.price * (service.estimatedHours || 1)).toLocaleString()}€`
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-900 text-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total estimé</span>
                  <span className="text-2xl font-bold">{totalPrice.toLocaleString()}€</span>
                </div>
                <p className="text-gray-300 text-sm mt-2">
                  * Prix indicatif. Le devis final sera établi selon vos besoins spécifiques.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="w-1/2 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Détails du projet
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder="Décrivez votre projet, vos besoins spécifiques, délais souhaités..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
