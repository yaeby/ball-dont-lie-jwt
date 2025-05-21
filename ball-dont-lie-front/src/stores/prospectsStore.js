import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"; 

export const useProspectsStore = defineStore("prospects", {
    state: () => ({
        prospects: [],
        loading: false,
        error: null,
        pagination: {
            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            pageSize: 10
        },
        sortField: "id",
        sortDirection: "asc"
    }),

    getters: {
        hasPrevious: (state) => state.pagination.currentPage > 0,
        hasNext: (state) => state.pagination.currentPage < state.pagination.totalPages - 1
    },
    
    actions: {
        async fetchProspects(page = 0, size = 10, sortBy = "id", direction = "asc") {
            const authStore = useAuthStore();
            
            if (!authStore.checkToken()) {
                await authStore.getVisitorToken();
            }
            
            this.loading = true;
            try {
                const response = await axios.get('/prospects', {
                    headers: { 
                        Accept: 'application/json',
                        Authorization: `Bearer ${authStore.token}`
                    },
                    params: {
                        page,
                        size,
                        sortBy,
                        direction
                    }
                });
                
                this.prospects = response.data.players;
                this.pagination = {
                    currentPage: response.data.currentPage,
                    totalItems: response.data.totalItems,
                    totalPages: response.data.totalPages,
                    pageSize: size
                };
                this.sortField = sortBy;
                this.sortDirection = direction;
                
                this.error = null;
                console.log('Fetched prospects:', this.prospects);
                console.log('Pagination info:', this.pagination);
            } catch (error) {
                console.error('Error fetching prospects:', error);
                this.error = 'Failed to load prospects. Please try again later.';
                
                if (error.response && error.response.status === 401) {
                    authStore.clearToken();
                    this.error = 'Authentication error. Please get a new token.';
                }
            } finally {
                this.loading = false;
            }
        },
        
        async goToPage(page) {
            await this.fetchProspects(page, this.pagination.pageSize, this.sortField, this.sortDirection);
        },
        
        async nextPage() {
            if (this.pagination.currentPage < this.pagination.totalPages - 1) {
                await this.goToPage(this.pagination.currentPage + 1);
            }
        },
        
        async prevPage() {
            if (this.pagination.currentPage > 0) {
                await this.goToPage(this.pagination.currentPage - 1);
            }
        },
        
        async getProspectById(id) {
            const authStore = useAuthStore();
            
            if (!authStore.checkToken()) {
                await authStore.getVisitorToken();
            }
            
            try {
                const response = await axios.get(`/prospects/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error(`Error fetching prospect with id ${id}:`, error);
                throw error;
            }
        },
        
        async createProspect(prospect) {
            const authStore = useAuthStore();

            console.log("Attempting to create prospect...");
            console.log("Current token:", authStore.token);
            console.log("Current role:", authStore.userRole);
            console.log("Current permissions:", authStore.userPermissions);

            if (!authStore.checkToken() || authStore.userRole !== 'WRITER') {
                console.log("Requesting WRITER token...");
                await authStore.getWriterToken();
                console.log("New token:", authStore.token);
                console.log("New role:", authStore.userRole);
                console.log("New permissions:", authStore.userPermissions);
            }

            if (!authStore.canCreate) {
                throw new Error('Insufficient permissions to create prospects');
            }

            this.loading = true;
            try {
                await axios.post('/prospects', prospect, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                await this.fetchProspects();
                return { success: true, message: 'Prospect created successfully' };
            } catch (error) {
                console.error('Error creating prospect:', error);
                
                if (error.response && error.response.status === 403) {
                    return { success: false, message: 'Insufficient permissions to create prospects' };
                }
                
                return { success: false, message: 'Failed to create prospect' };
            } finally {
                this.loading = false;
            }
        },
        
        async updateProspect(id, prospect) {
            const authStore = useAuthStore();

            console.log("Attempting to update prospect...");
            console.log("Current token:", authStore.token);
            console.log("Current role:", authStore.userRole);
            console.log("Current permissions:", authStore.userPermissions);

            if (!authStore.checkToken() || authStore.userRole !== 'WRITER') {
                console.log("Requesting WRITER token...");
                await authStore.getWriterToken();
                console.log("New token:", authStore.token);
                console.log("New role:", authStore.userRole);
                console.log("New permissions:", authStore.userPermissions);
            }

            if (!authStore.canUpdate) {
                throw new Error('Insufficient permissions to update prospects');
            }

            this.loading = true;
            try {
                await axios.put(`/prospects/${id}`, prospect, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                await this.fetchProspects();
                return { success: true, message: 'Prospect updated successfully' };
            } catch (error) {
                console.error(`Error updating prospect with id ${id}:`, error);
                
                if (error.response && error.response.status === 403) {
                    return { success: false, message: 'Insufficient permissions to update prospects' };
                }
                
                return { success: false, message: 'Failed to update prospect' };
            } finally {
                this.loading = false;
            }
        },
        
        async deleteProspect(id) {
            const authStore = useAuthStore();

            console.log("Attempting to delete prospect...");
            console.log("Current token:", authStore.token);
            console.log("Current role:", authStore.userRole);
            console.log("Current permissions:", authStore.userPermissions);

            if (!authStore.checkToken() || authStore.userRole !== 'ADMIN') {
                console.log("Requesting ADMIN token...");
                await authStore.getAdminToken();
                console.log("New token:", authStore.token);
                console.log("New role:", authStore.userRole);
                console.log("New permissions:", authStore.userPermissions);
            }

            if (!authStore.canDelete) {
                throw new Error('Insufficient permissions to delete prospects');
            }

            this.loading = true;
            try {
                await axios.delete(`/prospects/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }
                });
                this.prospects = this.prospects.filter(prospect => prospect.id !== id);
                return { success: true, message: 'Prospect deleted successfully' };
            } catch (error) {
                console.error(`Error deleting prospect with id ${id}:`, error);
                
                if (error.response && error.response.status === 403) {
                    return { success: false, message: 'Insufficient permissions to delete prospects' };
                }
                
                return { success: false, message: 'Failed to delete prospect' };
            } finally {
                this.loading = false;
            }
        }
    }
});