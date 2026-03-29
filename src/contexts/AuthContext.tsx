/**
 * ============================================
 * CONTEXTE D'AUTHENTIFICATION
 * ============================================
 * 
 * Ce contexte fournit l'état d'authentification global à toute l'application.
 * Il gère la connexion, déconnexion et la persistance de l'état utilisateur.
 * 
 * Utilisation :
 * const { user, login, logout, isAuthenticated } = useAuth();
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

/**
 * Interface pour l'utilisateur
 */
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface pour le contexte d'authentification
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * Créer le contexte d'authentification
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props pour le provider d'authentification
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Vérifier l'authentification au chargement de l'application
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Vérifier si un token existe
      if (!apiClient.isAuthenticated()) {
        setUser(null);
        return;
      }

      // Récupérer les informations de l'utilisateur
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
      
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      // En cas d'erreur, supprimer le token et déconnecter
      apiClient.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Se connecter
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Optionnel : rediriger vers le dashboard admin
        if (response.data.user.role === 'ADMIN') {
          // La redirection sera gérée par les composants qui utilisent ce contexte
          console.log('✅ Connexion admin réussie');
        }
      } else {
        throw new Error(response.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Se déconnecter
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      await apiClient.logout();
      setUser(null);
      
      // Optionnel : rediriger vers la page d'accueil
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Déconnecter quand même en cas d'erreur
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vérifier l'authentification au montage du composant
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Écouter les changements de token dans d'autres onglets
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          // Token ajouté, vérifier l'authentification
          checkAuth();
        } else {
          // Token supprimé, déconnecter
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /**
   * Calculer les valeurs dérivées
   */
  const isAuthenticated = !!user && apiClient.isAuthenticated();
  const isAdmin = user?.role === 'ADMIN';

  /**
   * Valeur du contexte
   */
  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte d'authentification
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
}

/**
 * Hook pour protéger les routes admin
 */
export function useRequireAuth(requireAdmin: boolean = false) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Rediriger vers la page de connexion
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (requireAdmin && !isAdmin) {
        // Rediriger vers la page d'accueil si admin requis
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin]);

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
  };
}

/**
 * Composant pour protéger les routes
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallback = null 
}: ProtectedRouteProps) {
  const { loading, isAuthenticated, isAdmin } = useRequireAuth(requireAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requireAdmin && !isAdmin) {
    return fallback || null;
  }

  return <>{children}</>;
}

/**
 * Composant pour afficher du contenu différent selon l'état d'authentification
 */
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback = null, 
  requireAdmin = false 
}: AuthGuardProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requireAdmin && !isAdmin) {
    return fallback || null;
  }

  return <>{children}</>;
}

/**
 * Hook pour obtenir les informations de l'utilisateur de manière sécurisée
 */
export function useUser() {
  const { user, isAuthenticated } = useAuth();
  
  return {
    user: isAuthenticated ? user : null,
    isAuthenticated,
  };
}
