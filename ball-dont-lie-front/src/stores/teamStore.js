import { defineStore } from 'pinia';
import { BalldontlieAPI } from "@balldontlie/sdk";

const API_KEY = import.meta.env.VITE_API_KEY || process.env.API_KEY;

const api = new BalldontlieAPI({ apiKey: API_KEY });

export const useTeamStore = defineStore('teams', {
    state: () => ({
        teams: [],
        currentTeam: null
    }),
    
    actions: {
        async fetchTeams() {
            try {
                const response = await api.nba.getTeams();
                const allTeams = Array.isArray(response) ? response : (response.data ? response.data : []);
                
                this.teams = allTeams.filter(team => team.city && team.city.trim() !== null);
                console.log("Teams fetched successfully:", this.teams);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        },
        
        async fetchTeamById(id) {
            try {
                // First check if we already have the team in the teams array
                const existingTeam = this.teams.find(team => team.id === parseInt(id));
                if (existingTeam) {
                    this.currentTeam = existingTeam;
                    return existingTeam;
                }
                
                // If not found in current teams array, fetch it from the API
                const response = await api.nba.getTeamById({ id: parseInt(id) });
                this.currentTeam = response;
                return response;
            } catch (error) {
                console.error(`Error fetching team with id ${id}:`, error);
                return null;
            }
        },
        
        clearCurrentTeam() {
            this.currentTeam = null;
        }
    },
})