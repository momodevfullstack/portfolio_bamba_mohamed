'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '../../../lib/api';
import { useNotifications } from '@/contexts/NotificationContext';
import { useApi } from '@/hooks/useApi';

export default function Projects() {
  const { showSuccess, showError } = useNotifications();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [form, setForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'web',
    status: 'in-progress',
    featured: false,
    image: '/project-placeholder.jpg',
    technologies: '', // input texte, séparé par virgules
    url: '',
    githubUrl: '',
  });

  const isFormValid = useMemo(() => {
    const titleOk = form.title.trim().length >= 3;
    const descOk = form.description.trim().length >= 10;
    const shortOk = (form.shortDescription || form.description).trim().length >= 5;
    const imageOk = form.image && form.image.trim().length >= 5;
    const categoryOk = ['web', 'mobile', 'fullstack', 'other'].includes(form.category);
    const statusOk = ['completed', 'in-progress', 'on-hold'].includes(form.status);
    return titleOk && descOk && shortOk && imageOk && categoryOk && statusOk;
  }, [form]);

  const { data: listData, execute: executeList } = useApi<{ data: any[]; meta: any }>();
  const { execute: execCreate } = useApi<any>();
  const { execute: execDelete } = useApi<any>();
  const { execute: execUpdate } = useApi<any>();

  const [editForm, setEditForm] = useState<any>(null);
  const [editStep, setEditStep] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    executeList(() => apiClient.getProjects({ limit: 50 }));
  }, [executeList]);

  const projects = useMemo(() => {
    const items = listData?.data || [];
    return items.map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.shortDescription || p.description,
      technologies: Array.isArray(p.technologies) ? p.technologies.map((t: any) => t.name || t) : [],
      media: { type: 'image', src: p.image || (p.images && p.images[0]?.url) || '/photo1.jfif' },
      github: p.githubUrl || '#',
      demo: p.url || '#',
      status: p.status === 'completed' ? 'published' : p.status === 'on-hold' ? 'archived' : 'draft',
      featured: !!p.featured,
      dateCreated: p.createdAt || new Date().toISOString(),
      category: (p.category || 'WEB')
        .replace('FULLSTACK', 'Full-Stack')
        .replace('WEB', 'Frontend')
        .replace('OTHER', 'Frontend'),
      tags: [],
    }));
  }, [listData]);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter((project: any) => {
      // Filtrage par statut
      if (filter !== 'all' && project.status !== filter) return false;
      
      // Filtrage par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.category.toLowerCase().includes(searchLower) ||
          project.technologies.some((tech: string) => tech.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });

    // Tri
    filtered.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'dateCreated':
          aValue = new Date(a.dateCreated).getTime();
          bValue = new Date(b.dateCreated).getTime();
          break;
        default:
          aValue = new Date(a.dateCreated).getTime();
          bValue = new Date(b.dateCreated).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projects, filter, searchTerm, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
      default: return 'Inconnu';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Full-Stack': return '🚀';
      case 'Frontend': return '⚛️';
      case 'Backend': return '🔧';
      case 'Mobile': return '📱';
      default: return '📄';
    }
  };

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p: any) => p.status === 'published').length;
  const featuredProjects = projects.filter((p: any) => p.featured).length;
  const draftProjects = projects.filter((p: any) => p.status === 'draft').length;

  const resetForm = () => {
    setForm({
      title: '', 
      description: '', 
      shortDescription: '', 
      category: 'web', 
      status: 'in-progress',
      featured: false, 
      image: '/photo1.jfif', 
      technologies: '', 
      url: '', 
      githubUrl: ''
    });
    setCurrentStep(1);
  };

  const handleCreate = async () => {
    const technologies = form.technologies
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    try {
      const result = await execCreate(() => apiClient.createProject({
      title: form.title,
      description: form.description,
      shortDescription: form.shortDescription || form.description,
      image: form.image,
      images: [],
      technologies,
        category: form.category as any, // web | mobile | fullstack | other
      client: undefined,
      url: form.url || undefined,
      githubUrl: form.githubUrl || undefined,
      status: form.status as any,
      featured: !!form.featured,
      }));
      if (result) showSuccess('Projet créé', 'Le projet a été créé avec succès.');
    } catch (e: any) {
      showError('Erreur', e?.message || 'Création du projet échouée');
    }
    setShowAddProject(false);
    resetForm();
    await executeList(() => apiClient.getProjects({ limit: 50 }));
  };

  const handleDelete = async (id: string) => {
    try {
      await execDelete(() => apiClient.deleteProject(id));
      await executeList(() => apiClient.getProjects({ limit: 50 }));
      setSelectedProject(null);
      showSuccess('Projet supprimé', 'Le projet a été supprimé.');
    } catch (e: any) {
      showError('Erreur', e?.message || 'Suppression échouée');
    }
  };

  const startEdit = () => {
    if (!selectedProject) return;
    setShowEditModal(true);
    setEditStep(1);
    setEditForm({
      title: selectedProject.title || '',
      description: selectedProject.description || '',
      shortDescription: selectedProject.description || '',
      image: selectedProject.media?.src || '/photo1.jfif',
      technologies: (selectedProject.technologies || []).join(', '),
      category: (selectedProject.category === 'Full-Stack' ? 'fullstack' : selectedProject.category === 'Mobile' ? 'mobile' : 'web'),
      status: (selectedProject.status === 'published' ? 'completed' : selectedProject.status === 'archived' ? 'on-hold' : 'in-progress'),
      featured: !!selectedProject.featured,
      url: selectedProject.demo || '',
      githubUrl: selectedProject.github || '',
    });
  };

  const resetEditForm = () => {
    setShowEditModal(false);
    setEditForm(null);
    setEditStep(1);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadedUrl = await apiClient.uploadImage(file);
      setEditForm((prev: any) => ({ ...prev, image: uploadedUrl }));
      showSuccess('Image uploadée', 'L\'image a été uploadée avec succès.');
    } catch (error: any) {
      showError('Erreur d\'upload', error?.message || 'Échec de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const saveEdit = async () => {
    if (!selectedProject) return;
    
    console.log('🔧 Saving edit for project:', selectedProject.id);
    console.log('🔧 Edit form data:', editForm);
    console.log('🔧 Auth token:', apiClient.getToken());
    
    const technologies = (editForm.technologies || '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
    
    const updateData = {
      title: editForm.title,
      description: editForm.description,
      shortDescription: editForm.shortDescription || editForm.description,
      image: editForm.image,
      technologies,
      category: editForm.category, // web | mobile | fullstack | other
      url: editForm.url || undefined,
      githubUrl: editForm.githubUrl || undefined,
      status: editForm.status,
      featured: !!editForm.featured,
    };
    
    console.log('🔧 Update data:', updateData);
    
    try {
      const result = await execUpdate(() => apiClient.updateProject(selectedProject.id, updateData));
      console.log('✅ Update result:', result);
      showSuccess('Projet modifié', 'Les modifications ont été enregistrées.');
    } catch (e: any) {
      console.error('❌ Update error:', e);
      showError('Erreur', e?.message || 'Modification échouée');
      return; // Ne pas fermer le formulaire en cas d'erreur
    }
    
    resetEditForm();
    await executeList(() => apiClient.getProjects({ limit: 50 }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Projets Portfolio</h1>
          <p className="text-gray-600">Gérez vos projets et leur visibilité</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">Tous les projets</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="archived">Archivés</option>
          </select>
          
          <button 
            onClick={() => setShowAddProject(true)}
            className="w-full sm:w-auto bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors"
          >
            Ajouter un projet
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total projets</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProjects}</p>
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
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-2xl font-semibold text-gray-900">{publishedProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En vedette</p>
              <p className="text-2xl font-semibold text-gray-900">{featuredProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-semibold text-gray-900">{draftProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Trier par:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dateCreated">Date de création</option>
              <option value="title">Titre</option>
              <option value="category">Catégorie</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Trier ${sortOrder === 'asc' ? 'décroissant' : 'croissant'}`}
            >
              <svg className={`w-4 h-4 text-gray-600 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Projets ({filteredProjects.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilter('published')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Publiés
            </button>
            <button 
              onClick={() => setFilter('draft')}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === 'draft' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Brouillons
            </button>
          </div>
        </div>
        
        {listData === null ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chargement des projets...</h3>
            <p className="text-gray-600">Récupération des données en cours.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' ? 'Aucun projet trouvé' : 'Aucun projet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche ou de filtrage.' 
                : 'Commencez par créer votre premier projet.'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => setShowAddProject(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un projet
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Image Header */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {project.media?.src ? (
                      <img
                        src={project.media.src}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-gray-400">{getCategoryIcon(project.category)}</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          ⭐ Vedette
                        </span>
                      </div>
                    )}
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                            startEdit();
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>
                        {new Date(project.dateCreated).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex items-center space-x-2">
                        {project.github !== '#' && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Code source"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {project.demo !== '#' && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Démo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setSelectedProject(null)}
            />
            
            <div className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <p className="text-gray-600">{selectedProject.category}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Project info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{selectedProject.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag: string, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Liens</h3>
                      <div className="space-y-2">
                        <a href={selectedProject.github} className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Code source
                        </a>
                        <a href={selectedProject.demo} className="flex items-center text-blue-600 hover:text-blue-800 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Démo live
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Project settings */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Paramètres</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject.status)}`}>
                            {getStatusLabel(selectedProject.status)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">En vedette:</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedProject.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedProject.featured ? 'Oui' : 'Non'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Type de média:</span>
                          <span className="text-sm text-gray-900 capitalize">{selectedProject.media.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Créé le:</span>
                          <span className="text-sm text-gray-900">{new Date(selectedProject.dateCreated).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Dupliquer
                  </button>
                  <button onClick={startEdit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(selectedProject.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {
                setShowAddProject(false);
                resetForm();
              }}
            />
            
            <div className="relative w-full max-w-4xl mx-4 bg-white rounded-xl shadow-xl max-h-[95vh] overflow-y-auto">
              {/* Header avec étapes */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Créer un nouveau projet</h2>
                  <button
                    onClick={() => {
                      setShowAddProject(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                        ${currentStep >= step 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        {currentStep > step ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step === 1 && 'Informations'}
                        {step === 2 && 'Média & Liens'}
                        {step === 3 && 'Configuration'}
                      </span>
                      {step < 3 && (
                        <div className={`ml-4 w-12 h-0.5 ${
                          currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu du formulaire par étapes */}
              <div className="p-6">
                {/* Étape 1: Informations de base */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Informations du projet</h3>
                      <p className="text-gray-600">Donnez un nom et une description à votre projet</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre du projet *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Mon super projet"
                            value={form.title}
                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                          />
                          {form.title && form.title.length < 3 && (
                            <p className="text-red-500 text-xs mt-1">Minimum 3 caractères</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description courte
                          </label>
                          <textarea
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Une description courte et accrocheuse..."
                            value={form.shortDescription}
                            onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technologies *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="React, Node.js, MongoDB (séparées par des virgules)"
                            value={form.technologies}
                            onChange={(e) => setForm(prev => ({ ...prev, technologies: e.target.value }))}
                          />
                          <p className="text-gray-500 text-xs mt-1">Séparez chaque technologie par une virgule</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description complète *
                        </label>
                        <textarea
                          rows={8}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Décrivez en détail votre projet, ses fonctionnalités, les défis rencontrés, etc."
                          value={form.description}
                          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        />
                        {form.description && form.description.length < 10 && (
                          <p className="text-red-500 text-xs mt-1">Minimum 10 caractères</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 2: Média et liens */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Média et liens</h3>
                      <p className="text-gray-600">Ajoutez une image et les liens vers votre projet</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Upload d'image */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image de couverture *
                          </label>
                          
                          {form.image && (
                            <div className="mb-4">
                              <img
                                src={form.image}
                                alt="Aperçu"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}

                          <div className="space-y-3">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const uploadedUrl = await apiClient.uploadImage(file);
                                    setForm(prev => ({ ...prev, image: uploadedUrl }));
                                    showSuccess('Image uploadée', 'Votre image a été uploadée avec succès.');
                                  } catch (err: any) {
                                    showError('Erreur d\'upload', err?.message || 'Échec de l\'upload');
                                  }
                                }}
                              />
                              <div className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
                                <div className="flex flex-col items-center">
                                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span className="text-sm text-gray-600">Cliquez pour uploader une image</span>
                                  <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF jusqu'à 10MB</span>
                                </div>
                              </div>
                            </label>

                            <div className="text-center text-gray-500 text-sm">ou</div>

                            <input
                              type="url"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://exemple.com/image.jpg"
                              value={form.image}
                              onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Liens */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien de démonstration
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://demo.monprojet.com"
                            value={form.url}
                            onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien GitHub
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/user/project"
                            value={form.githubUrl}
                            onChange={(e) => setForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex">
                            <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Conseil</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Ajoutez une image attractive et des liens vers votre démo et code source pour améliorer la visibilité de votre projet.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 3: Configuration */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuration finale</h3>
                      <p className="text-gray-600">Définissez la catégorie, le statut et les options du projet</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie *
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={form.category}
                            onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                          >
                            <option value="web">🌐 Développement Web</option>
                            <option value="mobile">📱 Application Mobile</option>
                            <option value="fullstack">🚀 Projet Full-Stack</option>
                            <option value="other">🔧 Autre</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut *
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={form.status}
                            onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                          >
                            <option value="in-progress">📝 Brouillon</option>
                            <option value="completed">✅ Publié</option>
                            <option value="on-hold">⏸️ En pause</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Options</h4>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="featured"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={form.featured}
                              onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                            />
                            <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-700">
                              Mettre en vedette
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Les projets en vedette apparaissent en premier dans votre portfolio.
                          </p>
                        </div>

                        {/* Aperçu du projet */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Aperçu</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Titre:</span>
                              <span className="font-medium">{form.title || 'Non défini'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Catégorie:</span>
                              <span className="font-medium capitalize">{form.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Statut:</span>
                              <span className="font-medium">
                                {form.status === 'completed' && 'Publié'}
                                {form.status === 'in-progress' && 'Brouillon'}
                                {form.status === 'on-hold' && 'En pause'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Technologies:</span>
                              <span className="font-medium">{form.technologies.split(',').length} tech(s)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setShowAddProject(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {currentStep === 1 ? 'Annuler' : 'Précédent'}
                  </button>

                  <div className="flex space-x-3">
                    {currentStep < 3 ? (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Suivant
                      </button>
                    ) : (
                      <button
                        onClick={handleCreate}
                        disabled={!isFormValid}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Créer le projet
                      </button>
                    )}
                  </div>
                </div>

                {/* Validation errors */}
                {!isFormValid && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Champs requis manquants</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Vérifiez que tous les champs obligatoires sont remplis correctement.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={resetEditForm}
            />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Modifier le projet</h2>
                    <p className="text-gray-600 mt-1">Mettez à jour les informations de votre projet</p>
                  </div>
                  <button
                    onClick={resetEditForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center space-x-4 mt-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                        ${editStep >= step 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        {editStep > step ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                      <span className={`ml-3 text-sm font-medium ${
                        editStep >= step ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {step === 1 && 'Informations'}
                        {step === 2 && 'Média & Liens'}
                        {step === 3 && 'Configuration'}
                      </span>
                      {step < 3 && (
                        <div className={`ml-6 w-12 h-0.5 ${
                          editStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenu du formulaire d'édition par étapes */}
              <div className="p-6">
                {/* Étape 1: Informations de base */}
                {editStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Modifier les informations</h3>
                      <p className="text-gray-600">Mettez à jour le titre, la description et les technologies</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre du projet *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Mon super projet"
                            value={editForm?.title || ''}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, title: e.target.value }))}
                          />
                          {editForm?.title && editForm.title.length < 3 && (
                            <p className="text-red-500 text-xs mt-1">Minimum 3 caractères</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description courte
                          </label>
                          <textarea
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Une description courte et accrocheuse..."
                            value={editForm?.shortDescription || ''}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Technologies *
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="React, Node.js, MongoDB (séparées par des virgules)"
                            value={editForm?.technologies || ''}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, technologies: e.target.value }))}
                          />
                          <p className="text-gray-500 text-xs mt-1">Séparez chaque technologie par une virgule</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description complète *
                        </label>
                        <textarea
                          rows={8}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Décrivez en détail votre projet, ses fonctionnalités, les défis rencontrés, etc."
                          value={editForm?.description || ''}
                          onChange={(e) => setEditForm((prev: any) => ({ ...prev, description: e.target.value }))}
                        />
                        {editForm?.description && editForm.description.length < 10 && (
                          <p className="text-red-500 text-xs mt-1">Minimum 10 caractères</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 2: Média et liens */}
                {editStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Modifier les médias et liens</h3>
                      <p className="text-gray-600">Changez l'image et mettez à jour les liens</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Upload d'image */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image de couverture
                          </label>
                          
                          {editForm?.image && (
                            <div className="mb-4">
                              <img
                                src={editForm.image}
                                alt="Aperçu"
                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}

                          <div className="space-y-3">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const uploadedUrl = await apiClient.uploadImage(file);
                                    setEditForm((prev: any) => ({ ...prev, image: uploadedUrl }));
                                    showSuccess('Image uploadée', 'Votre image a été uploadée avec succès.');
                                  } catch (err: any) {
                                    showError('Erreur d\'upload', err?.message || 'Échec de l\'upload');
                                  }
                                }}
                              />
                              <div className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 transition-colors">
                                <div className="flex flex-col items-center">
                                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <span className="text-sm text-gray-600">
                                    {isUploading ? 'Upload en cours...' : 'Cliquez pour changer l\'image'}
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">JPG, PNG, GIF jusqu'à 10MB</span>
                                </div>
                              </div>
                            </label>

                            <div className="text-center text-gray-500 text-sm">ou</div>

                            <input
                              type="url"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://exemple.com/nouvelle-image.jpg"
                              value={editForm?.image || ''}
                              onChange={(e) => setEditForm((prev: any) => ({ ...prev, image: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Liens */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien de démonstration
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://demo.monprojet.com"
                            value={editForm?.url || ''}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, url: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lien GitHub
                          </label>
                          <input
                            type="url"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://github.com/user/project"
                            value={editForm?.githubUrl || ''}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, githubUrl: e.target.value }))}
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex">
                            <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Conseil</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Assurez-vous que les liens sont valides et que l'image est de bonne qualité pour optimiser la présentation de votre projet.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 3: Configuration */}
                {editStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Configuration finale</h3>
                      <p className="text-gray-600">Ajustez la catégorie, le statut et les options</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catégorie *
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editForm?.category || 'web'}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, category: e.target.value }))}
                          >
                            <option value="web">🌐 Développement Web</option>
                            <option value="mobile">📱 Application Mobile</option>
                            <option value="fullstack">🚀 Projet Full-Stack</option>
                            <option value="other">🔧 Autre</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut *
                          </label>
                          <select
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={editForm?.status || 'in-progress'}
                            onChange={(e) => setEditForm((prev: any) => ({ ...prev, status: e.target.value }))}
                          >
                            <option value="in-progress">📝 Brouillon</option>
                            <option value="completed">✅ Publié</option>
                            <option value="on-hold">⏸️ En pause</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Options</h4>
                          
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="editFeatured"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={editForm?.featured || false}
                              onChange={(e) => setEditForm((prev: any) => ({ ...prev, featured: e.target.checked }))}
                            />
                            <label htmlFor="editFeatured" className="ml-3 text-sm font-medium text-gray-700">
                              Mettre en vedette
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Les projets en vedette apparaissent en premier dans votre portfolio.
                          </p>
                        </div>

                        {/* Aperçu des modifications */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Aperçu des modifications</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Titre:</span>
                              <span className="font-medium">{editForm?.title || 'Non défini'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Catégorie:</span>
                              <span className="font-medium capitalize">{editForm?.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Statut:</span>
                              <span className="font-medium">
                                {editForm?.status === 'completed' && 'Publié'}
                                {editForm?.status === 'in-progress' && 'Brouillon'}
                                {editForm?.status === 'on-hold' && 'En pause'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Technologies:</span>
                              <span className="font-medium">{editForm?.technologies?.split(',').length || 0} tech(s)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">En vedette:</span>
                              <span className="font-medium">{editForm?.featured ? 'Oui' : 'Non'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation pour l'édition */}
                <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={() => editStep > 1 ? setEditStep(editStep - 1) : resetEditForm()}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {editStep === 1 ? 'Annuler' : 'Précédent'}
                  </button>

                  <div className="flex space-x-3">
                    {editStep < 3 ? (
                      <button
                        onClick={() => setEditStep(editStep + 1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Suivant
                      </button>
                    ) : (
                      <button
                        onClick={saveEdit}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Enregistrer les modifications
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

