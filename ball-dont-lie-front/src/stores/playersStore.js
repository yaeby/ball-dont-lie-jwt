import { defineStore } from "pinia";
import { BalldontlieAPI } from "@balldontlie/sdk";

const API_KEY = import.meta.env.VITE_API_KEY || process.env.API_KEY;

const api = new BalldontlieAPI({ apiKey: API_KEY });

export const usePlayerStore = defineStore("players", {
    state: () => ({
        players: [],
        currentPlayer: null,
        pagination: {
            cursor: null,
            perPage: 24,
            hasNextPage: false,
            hasPreviousPage: false,
            pageNumber: 1 
        },
        searchParams: {
            search: '',
            firstName: '',
            lastName: '',
            teamIds: [],
        },
        previousCursors: []
    }),

    actions: {
        async fetchPlayers(params = {}) {
            try {
                if (params.perPage) {
                    this.pagination.perPage = params.perPage;
                }
                
                const queryParams = {
                    per_page: this.pagination.perPage,
                    cursor: params.cursor,
                    search: params.search !== undefined ? params.search : this.searchParams.search,
                    first_name: params.firstName || this.searchParams.firstName,
                    last_name: params.lastName || this.searchParams.lastName,
                };
                
                if (params.teamIds?.length || this.searchParams.teamIds.length) {
                    queryParams.team_ids = params.teamIds || this.searchParams.teamIds;
                }

                Object.keys(queryParams).forEach(key => {
                    if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
                        delete queryParams[key];
                    }
                });
                
                if (!params.cursor) {
                    this.previousCursors = [];
                    this.pagination.pageNumber = 1;
                    this.pagination.hasPreviousPage = false;
                }
                
                const response = await api.nba.getPlayers(queryParams);
                
                if (response && response.data) {
                    this.players = response.data;
                    
                    if (response.meta) {
                        if (this.pagination.cursor) {
                            this.previousCursors.push(this.pagination.cursor);
                        }
                        
                        this.pagination.cursor = response.meta.next_cursor;
                        this.pagination.hasNextPage = !!response.meta.next_cursor;
                        this.pagination.hasPreviousPage = this.previousCursors.length > 0;
                    }
                    
                    this.searchParams = {
                        search: params.search !== undefined ? params.search : this.searchParams.search,
                        firstName: params.firstName || this.searchParams.firstName,
                        lastName: params.lastName || this.searchParams.lastName,
                        teamIds: params.teamIds || this.searchParams.teamIds
                    };
                }
                
                console.log("Players fetched successfully:", this.players);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        },
        
        async fetchPlayerById(id) {
            try {
                // First check if we already have the player in our array
                const existingPlayer = this.players.find(player => player.id === parseInt(id));
                if (existingPlayer) {
                    this.currentPlayer = existingPlayer;
                    return existingPlayer;
                }
                
                // If not found in current players array, fetch from API
                const response = await api.nba.getPlayerById({ id: parseInt(id) });
                this.currentPlayer = response;
                return response;
            } catch (error) {
                console.error(`Error fetching player with id ${id}:`, error);
                return null;
            }
        },
        
        clearCurrentPlayer() {
            this.currentPlayer = null;
        },
        
        async fetchNextPage() {
            if (this.pagination.hasNextPage) {
                this.pagination.pageNumber++;
                await this.fetchPlayers({ cursor: this.pagination.cursor });
            }
        },
        
        async fetchPreviousPage() {
            if (this.pagination.hasPreviousPage && this.previousCursors.length > 0) {
                const previousCursor = this.previousCursors.pop();
                this.pagination.pageNumber--;
                
                const cursorToUse = this.previousCursors.length > 0 
                    ? this.previousCursors[this.previousCursors.length - 1] 
                    : null;
                    
                if (this.previousCursors.length > 0) {
                    this.previousCursors.pop();
                }
                
                await this.fetchPlayers({ cursor: cursorToUse });
            }
        }
    },
});