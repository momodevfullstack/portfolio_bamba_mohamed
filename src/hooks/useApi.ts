/**
 * ============================================
 * HOOK PERSONNALISÉ POUR L'API
 * ============================================
 * 
 * Ce hook fournit une interface React pour utiliser le service API.
 * Il gère les états de chargement, les erreurs et les données.
 * 
 * Utilisation dans les composants :
 * const { data, loading, error, execute } = useApi();
 */

import { useState, useCallback } from 'react';
import { apiClient, ApiResponse } from '../lib/api';

/**
 * Interface pour l'état du hook useApi
 */
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Interface pour les options du hook useApi
 */
interface UseApiOptions {
  immediate?: boolean; // Exécuter immédiatement
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook personnalisé pour les requêtes API
 */
export function useApi<T = any>(options: UseApiOptions = {}) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Fonction pour exécuter une requête API
   */
  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      
      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        });

        // Appeler le callback de succès si défini
        if (options.onSuccess && response.data) {
          options.onSuccess(response.data);
        }

        return response.data;
      } else {
        const errorMessage = response.error || 'Une erreur est survenue';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        // Appeler le callback d'erreur si défini
        if (options.onError) {
          options.onError(errorMessage);
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      // Appeler le callback d'erreur si défini
      if (options.onError) {
        options.onError(errorMessage);
      }

      throw error;
    }
  }, [options.onSuccess, options.onError]);

  /**
   * Fonction pour réinitialiser l'état
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  /**
   * Fonction pour définir manuellement les données
   */
  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  /**
   * Fonction pour définir manuellement l'erreur
   */
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

/**
 * Hook spécialisé pour l'authentification
 */
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Vérifier l'authentification au chargement
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Se connecter
   */
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
        return response.data;
      }
      throw new Error(response.error || 'Erreur de connexion');
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);

  /**
   * Se déconnecter
   */
  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setUser(null); // Déconnecter quand même en cas d'erreur
    }
  }, []);

  /**
   * Vérifier si l'utilisateur est connecté
   */
  const isAuthenticated = useCallback(() => {
    return !!user && apiClient.isAuthenticated();
  }, [user]);

  /**
   * Vérifier si l'utilisateur est admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  return {
    user,
    loading,
    checkAuth,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
  };
}

/**
 * Hook pour les requêtes avec retry automatique
 */
export function useApiWithRetry<T = any>(maxRetries: number = 3) {
  const [retryCount, setRetryCount] = useState(0);
  const api = useApi<T>();

  const executeWithRetry = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await api.execute(apiCall);
        setRetryCount(0); // Reset du compteur en cas de succès
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Erreur inconnue');
        
        if (attempt < maxRetries) {
          // Attendre avant de réessayer (backoff exponentiel)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          setRetryCount(attempt + 1);
        }
      }
    }

    // Si toutes les tentatives ont échoué
    throw lastError;
  }, [api, maxRetries]);

  return {
    ...api,
    retryCount,
    execute: executeWithRetry,
  };
}

/**
 * Hook pour les requêtes de liste avec pagination
 */
export function usePaginatedApi<T = any>() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const api = useApi<{ data: T[]; meta: any }>();

  const executeWithPagination = useCallback(async (
    apiCall: (page: number, limit: number) => Promise<ApiResponse<{ data: T[]; meta: any }>>,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const result = await api.execute(() => apiCall(page, limit));
      
      if (result?.meta) {
        setPagination({
          page: result.meta.page,
          limit: result.meta.limit,
          total: result.meta.total,
          totalPages: result.meta.totalPages,
          hasNext: result.meta.hasNext,
          hasPrev: result.meta.hasPrev,
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }, [api]);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  return {
    ...api,
    pagination,
    goToPage,
    setPageSize,
    execute: executeWithPagination,
  };
}
