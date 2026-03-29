'use client';

import { useState } from 'react';

export default function Services() {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filter, setFilter] = useState('all');

  // Données simulées des devis
  const quotes = [
    {
      id: 1,
      customer: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      company: 'TechCorp',
      phone: '+33 1 23 45 67 89',
      services: [
        { name: 'Application basique / MVP', price: 8000, hours: 1, type: 'fixed' },
        { name: 'Authentification', price: 150, hours: 8, type: 'hourly' }
      ],
      totalPrice: 9200,
      status: 'pending',
      date: '2024-01-15T10:30:00',
      message: 'Nous avons besoin d\'une application de gestion d\'inventaire avec authentification utilisateur.',
      projectType: 'mobile-flutter',
      timeline: '1-2months'
    },
    {
      id: 2,
      customer: 'Marie Martin',
      email: 'marie.martin@company.com',
      company: 'E-commerce Plus',
      phone: '+33 6 78 90 12 34',
      services: [
        { name: 'Site vitrine (5-20 pages)', price: 2500, hours: 1, type: 'fixed' },
        { name: 'E-commerce (petite boutique)', price: 4500, hours: 1, type: 'fixed' }
      ],
      totalPrice: 7000,
      status: 'approved',
      date: '2024-01-14T14:20:00',
      message: 'Refonte complète de notre site e-commerce avec nouvelle interface.',
      projectType: 'web-nextjs',
      timeline: '2-3months'
    },
    {
      id: 3,
      customer: 'Pierre Durand',
      email: 'pierre.durand@startup.fr',
      company: 'StartupInnovante',
      phone: '+33 7 89 01 23 45',
      services: [
        { name: 'E-commerce moyen à avancé', price: 18000, hours: 1, type: 'fixed' },
        { name: 'API REST / GraphQL simple', price: 5000, hours: 1, type: 'fixed' }
      ],
      totalPrice: 23000,
      status: 'rejected',
      date: '2024-01-13T16:45:00',
      message: 'Marketplace B2B avec système de paiement intégré.',
      projectType: 'fullstack',
      timeline: 'urgent'
    },
    {
      id: 4,
      customer: 'Sophie Laurent',
      email: 'sophie.laurent@consulting.fr',
      company: 'Consulting Pro',
      phone: '+33 1 98 76 54 32',
      services: [
        { name: 'Audit technique de base', price: 500, hours: 1, type: 'fixed' },
        { name: 'Coaching développeurs débutants', price: 40, hours: 10, type: 'hourly' }
      ],
      totalPrice: 900,
      status: 'completed',
      date: '2024-01-12T09:15:00',
      message: 'Audit de notre architecture et formation de l\'équipe.',
      projectType: 'consulting',
      timeline: 'flexible'
    },
    {
      id: 5,
      customer: 'Thomas Bernard',
      email: 'thomas.bernard@agence.com',
      company: 'Agence Digital',
      phone: '+33 5 43 21 09 87',
      services: [
        { name: 'Application intermédiaire', price: 25000, hours: 1, type: 'fixed' },
        { name: 'API complexe / sur mesure', price: 15000, hours: 1, type: 'fixed' }
      ],
      totalPrice: 40000,
      status: 'pending',
      date: '2024-01-10T11:30:00',
      message: 'Application métier complète avec API backend.',
      projectType: 'fullstack',
      timeline: '3-6months'
    },
  ];

  const filteredQuotes = quotes.filter(quote => {
    if (filter === 'all') return true;
    return quote.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'completed': return 'Terminé';
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
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Services & Devis</h1>
          <p className="text-gray-600">Gérez les demandes de devis et les services</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Tous les devis</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
            <option value="completed">Terminés</option>
          </select>
          
          <button className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors">
            Nouveau devis
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quotes.filter(q => q.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approuvés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quotes.filter(q => q.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quotes.filter(q => q.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-semibold text-gray-900">
                €{quotes.filter(q => q.status === 'approved' || q.status === 'completed').reduce((sum, q) => sum + q.totalPrice, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Devis ({filteredQuotes.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              onClick={() => setSelectedQuote(quote)}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900">{quote.customer}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{quote.company}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{getProjectTypeLabel(quote.projectType)}</span>
                    <span>•</span>
                    <span>{quote.timeline}</span>
                    <span>•</span>
                    <span>{quote.services.length} service{quote.services.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">€{quote.totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(quote.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setSelectedQuote(null)}
            />
            
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Devis #{selectedQuote.id}</h2>
                  <p className="text-gray-600">{selectedQuote.customer} - {selectedQuote.company}</p>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Services */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Services demandés</h3>
                    <div className="space-y-3">
                      {selectedQuote.services.map((service, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              {service.type === 'hourly' && (
                                <p className="text-sm text-gray-600">{service.hours}h × {service.price}€/h</p>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              €{service.type === 'hourly' ? (service.price * service.hours).toLocaleString() : service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-900 text-white p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">€{selectedQuote.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Informations de contact</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</p>
                        <p className="text-sm text-gray-900">{selectedQuote.customer}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                        <a href={`mailto:${selectedQuote.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {selectedQuote.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</p>
                        <a href={`tel:${selectedQuote.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                          {selectedQuote.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Entreprise</p>
                        <p className="text-sm text-gray-900">{selectedQuote.company}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type de projet</p>
                        <p className="text-sm text-gray-900">{getProjectTypeLabel(selectedQuote.projectType)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Délai</p>
                        <p className="text-sm text-gray-900">{selectedQuote.timeline}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Message</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{selectedQuote.message}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Modifier
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Rejeter
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Approuver
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
