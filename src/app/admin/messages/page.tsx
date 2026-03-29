'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useNotifications } from '@/contexts/NotificationContext';

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotifications();
  const { execute: fetchMessages, execute: updateMessage } = useApi();

  // Charger les messages depuis l'API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const result = await fetchMessages(async () => {
          const { apiClient } = await import('@/lib/api');
          return apiClient.getMessages({
            limit: 50,
            status: filter === 'all' ? undefined : filter.toUpperCase()
          });
        });

        if (result?.data) {
          setMessages(result.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        showError('Erreur de chargement', 'Impossible de charger les messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [fetchMessages, filter, showError]);

  // Fonction pour mettre à jour le statut d'un message
  const handleUpdateStatus = async (messageId: string, newStatus: string) => {
    try {
      await updateMessage(async () => {
        const { apiClient } = await import('@/lib/api');
        return apiClient.updateMessage(messageId, { status: newStatus.toUpperCase() });
      });

      showSuccess('Statut mis à jour', 'Le statut du message a été mis à jour avec succès');
      
      // Recharger les messages
      const result = await fetchMessages(async () => {
        const { apiClient } = await import('@/lib/api');
        return apiClient.getMessages({ limit: 50 });
      });
      
      if (result?.data) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      showError('Erreur', 'Impossible de mettre à jour le statut du message');
    }
  };

  // Données simulées des messages (fallback)
  const fallbackMessages = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      company: 'TechCorp',
      phone: '+33 1 23 45 67 89',
      projectType: 'mobile-flutter',
      budget: '5k-15k',
      timeline: '1-2months',
      subject: 'Demande de devis - Application Flutter',
      message: 'Bonjour, je souhaite développer une application mobile pour ma startup. Nous avons besoin d\'une app de gestion d\'inventaire avec synchronisation en temps réel.',
      status: 'new',
      date: '2024-01-15T10:30:00',
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@company.com',
      company: 'E-commerce Plus',
      phone: '+33 6 78 90 12 34',
      projectType: 'web-nextjs',
      budget: '15k-30k',
      timeline: '2-3months',
      subject: 'Question sur vos services Next.js',
      message: 'Nous cherchons un développeur pour refaire notre site e-commerce. Avez-vous de l\'expérience avec Shopify et les intégrations de paiement ?',
      status: 'read',
      date: '2024-01-14T14:20:00',
    },
    {
      id: 3,
      name: 'Pierre Durand',
      email: 'pierre.durand@startup.fr',
      company: 'StartupInnovante',
      phone: '+33 7 89 01 23 45',
      projectType: 'ecommerce',
      budget: '30k-50k',
      timeline: 'urgent',
      subject: 'Projet e-commerce urgent',
      message: 'Nous avons un projet urgent pour creer une plateforme B2B. Nous avons deja le design et les specifications techniques. Pouvez-vous commencer rapidement ?',
      status: 'new',
      date: '2024-01-13T16:45:00',
    },
    {
      id: 4,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@consulting.fr',
      company: 'Consulting Pro',
      phone: '+33 1 98 76 54 32',
      projectType: 'consulting',
      budget: 'discuss',
      timeline: 'flexible',
      subject: 'Besoin de conseil technique',
      message: 'Nous avons une équipe de développement interne mais nous avons besoin d\'un expert pour auditer notre architecture et nous conseiller sur les bonnes pratiques.',
      status: 'replied',
      date: '2024-01-12T09:15:00',
    },
    {
      id: 5,
      name: 'Thomas Bernard',
      email: 'thomas.bernard@agence.com',
      company: 'Agence Digital',
      phone: '+33 5 43 21 09 87',
      projectType: 'fullstack',
      budget: '>50k',
      timeline: '3-6months',
      subject: 'Partenariat long terme',
      message: 'Nous cherchons un développeur freelance pour rejoindre notre équipe sur plusieurs projets. Seriez-vous intéressé par un contrat de 6 mois ?',
      status: 'archived',
      date: '2024-01-10T11:30:00',
    },
  ];

  // Utiliser les messages de l'API
  const displayMessages = messages;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'Nouveau';
      case 'read': return 'Lu';
      case 'replied': return 'Répondu';
      case 'archived': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const getProjectTypeLabel = (type) => {
    switch (type) {
      case 'mobile-flutter': return 'Application mobile (Flutter)';
      case 'web-nextjs': return 'Site web (Next.js)';
      case 'fullstack': return 'Application full-stack';
      case 'ecommerce': return 'E-commerce';
      case 'api': return 'API / Backend';
      case 'consulting': return 'Conseil technique';
      case 'formation': return 'Formation / Coaching';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Gérez les messages de contact et les demandes</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Tous les messages</option>
            <option value="new">Nouveaux</option>
            <option value="read">Lus</option>
            <option value="replied">Répondus</option>
            <option value="archived">Archivés</option>
          </select>
          
          <button className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors">
            Marquer comme lu
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Messages ({displayMessages.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun message</h3>
            <p className="text-gray-600">Aucun message trouvé avec les critères sélectionnés.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayMessages.map((message: any) => (
            <div
              key={message.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{message.name}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusLabel(message.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.projectType}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{message.email}</span>
                    <span>•</span>
                    <span>{message.budget}</span>
                    <span>•</span>
                    <span>{message.timeline}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{message.message}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(message);
                      }}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Voir
                    </button>
                    {message.status !== 'READ' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(message.id, 'READ');
                        }}
                        className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                      >
                        Marquer lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setSelectedMessage(null)}
            />
            
            <div className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                  <p className="text-gray-600">De {selectedMessage.name}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Message content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Message</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{selectedMessage.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Informations de contact</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</p>
                          <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                          <a href={`mailto:${selectedMessage.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                            {selectedMessage.email}
                          </a>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</p>
                          <a href={`tel:${selectedMessage.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                            {selectedMessage.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Entreprise</p>
                          <p className="text-sm text-gray-900">{selectedMessage.company}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type de projet</p>
                          <p className="text-sm text-gray-900">{getProjectTypeLabel(selectedMessage.projectType)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget</p>
                          <p className="text-sm text-gray-900">{selectedMessage.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Délai</p>
                          <p className="text-sm text-gray-900">{selectedMessage.timeline}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Archiver
                  </button>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors">
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
