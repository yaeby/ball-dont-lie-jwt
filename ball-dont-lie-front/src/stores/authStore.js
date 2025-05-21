import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem('auth_token') || null,
        role: localStorage.getItem('auth_role') || null,
        permissions: JSON.parse(localStorage.getItem('auth_permissions') || '[]'),
        loading: false,
        error: null
    }),
    
    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.role,
        userPermissions: (state) => state.permissions,
        
        canRead: (state) => {
            return state.role === 'ADMIN' || state.permissions.includes('READ');
        },
        
        canCreate: (state) => {
            return state.role === 'ADMIN' || state.permissions.includes('CREATE');
        },
        
        canUpdate: (state) => {
            return state.role === 'ADMIN' || state.permissions.includes('UPDATE');
        },
        
        canDelete: (state) => {
            return state.role === 'ADMIN' || state.permissions.includes('DELETE');
        }
    },
    
    actions: {
        async getToken(role = 'VISITOR', permissions = ['READ']) {
            this.loading = true;
            this.error = null;
            
            try {
                const params = new URLSearchParams();
                params.append('role', role);
                
                if (permissions && permissions.length) {
                    permissions.forEach(p => params.append('permissions', p));
                }
                
                const url = `/token?${params.toString()}`;
                console.log("Requesting token with URL:", url);
                
                const response = await axios.get(url);
                console.log("Token response:", response.data);
                
                this.setToken(response.data.token);
                this.loading = false;
                return response.data.token;
            } catch (error) {
                console.error('Error getting token:', error);
                this.error = 'Failed to get authorization token';
                this.loading = false;
                throw error;
            }
        },
        
        async getAdminToken() {
            return this.getToken('ADMIN', ['READ', 'CREATE', 'UPDATE', 'DELETE']);
        },
        
        async getWriterToken() {
            return this.getToken('WRITER', ['READ', 'CREATE', 'UPDATE']);
        },
        
        async getVisitorToken() {
            return this.getToken('VISITOR', ['READ']);
        },
        
        setToken(token) {
            this.token = token;
            localStorage.setItem('auth_token', token);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                this.role = tokenPayload.role;
                this.permissions = tokenPayload.permissions || [];
                
                localStorage.setItem('auth_role', this.role);
                localStorage.setItem('auth_permissions', JSON.stringify(this.permissions));
            } catch (e) {
                console.error('Error decoding token', e);
            }
        },
        
        clearToken() {
            this.token = null;
            this.role = null;
            this.permissions = [];
            
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_role');
            localStorage.removeItem('auth_permissions');
            
            delete axios.defaults.headers.common['Authorization'];
        },
        
        checkToken() {
            if (!this.token) return false;
            
            try {
                const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
                const expiration = tokenPayload.exp * 1000; 
                
                if (Date.now() >= expiration) {
                    console.log("Token expired, clearing");
                    this.clearToken();
                    return false;
                }
                
                return true;
            } catch (e) {
                console.error('Error checking token', e);
                this.clearToken(); 
                return false;
            }
        }
    }
});