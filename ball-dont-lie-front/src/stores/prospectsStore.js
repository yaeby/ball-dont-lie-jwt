import { defineStore } from "pinia";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"; // Ensure this points to your backend

export const useProspectsStore = defineStore("prospects", {
    state: () => ({
        prospects: [],
        loading: false,
        error: null
    }),
    
    actions: {
        async fetchProspects() {
            this.loading = true;
            try {
                const response = await axios.get('/prospects', {
                    headers: { Accept: 'application/json' },
                });
                this.prospects = response.data;
                this.error = null;
                console.log('Fetched prospects:', this.prospects);
            } catch (error) {
                console.error('Error fetching prospects:', error);
                this.error = 'Failed to load prospects. Please try again later.';
            } finally {
                this.loading = false;
            }
        },
        
        async getProspectById(id) {
            try {
                const response = await axios.get(`/prospects/${id}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching prospect with id ${id}:`, error);
                throw error;
            }
        },
        
        async createProspect(prospect) {
            this.loading = true;
            try {
                await axios.post('/prospects', prospect);
                await this.fetchProspects(); 
                return { success: true, message: 'Prospect created successfully' };
            } catch (error) {
                console.error('Error creating prospect:', error);
                return { success: false, message: 'Failed to create prospect' };
            } finally {
                this.loading = false;
            }
        },
        
        async updateProspect(id, prospect) {
            this.loading = true;
            try {
                await axios.put(`/prospects/${id}`, prospect);
                await this.fetchProspects(); 
                return { success: true, message: 'Prospect updated successfully' };
            } catch (error) {
                console.error(`Error updating prospect with id ${id}:`, error);
                return { success: false, message: 'Failed to update prospect' };
            } finally {
                this.loading = false;
            }
        },
        
        async deleteProspect(id) {
            this.loading = true;
            try {
                await axios.delete(`/prospects/${id}`);
                this.prospects = this.prospects.filter(prospect => prospect.id !== id);
                return { success: true, message: 'Prospect deleted successfully' };
            } catch (error) {
                console.error(`Error deleting prospect with id ${id}:`, error);
                return { success: false, message: 'Failed to delete prospect' };
            } finally {
                this.loading = false;
            }
        }
    }
});