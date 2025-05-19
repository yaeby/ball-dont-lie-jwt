import { defineStore } from "pinia";

export const useDreamTeamStore = defineStore("dreamTeam", {
    state: () => ({
        PG: JSON.parse(localStorage.getItem('PG')) || null,
        SG: JSON.parse(localStorage.getItem('SG')) || null,
        SF: JSON.parse(localStorage.getItem('SF')) || null,
        PF: JSON.parse(localStorage.getItem('PF')) || null,
        C: JSON.parse(localStorage.getItem('C')) || null,
        
        positionLabels: {
            PG: "Point Guard",
            SG: "Shooting Guard",
            SF: "Small Forward",
            PF: "Power Forward",
            C: "Center"
        }
    }),
    
    actions: {
        addPlayerToPosition(player, position) {
            if (!['PG', 'SG', 'SF', 'PF', 'C'].includes(position)) {
                return { success: false, message: "Invalid position" };
            }
            
            if (this[position] !== null) {
                return { 
                    success: false, 
                    message: `${this.positionLabels[position]} position is already filled` 
                };
            }
            
            this[position] = {
                id: player.id,
                first_name: player.first_name,
                last_name: player.last_name,
                position: player.position,
                team: player.team,
                jersey_number: player.jersey_number,
                country: player.country
            };
            
            localStorage.setItem(position, JSON.stringify(this[position]));
            
            return { 
                success: true, 
                message: `${player.first_name} ${player.last_name} added as ${this.positionLabels[position]}` 
            };
        },
        
        removePlayer(playerId) {
            const position = this.findPlayerPosition(playerId);
            
            if (!position) {
                return { success: false, message: "Player not in dream team" };
            }
            
            const playerName = `${this[position].first_name} ${this[position].last_name}`;
            
            this[position] = null;
            
            localStorage.removeItem(position);
            
            return { 
                success: true, 
                message: `${playerName} removed from ${this.positionLabels[position]} position` 
            };
        },
        
        findPlayerPosition(playerId) {
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                if (this[position] && this[position].id === playerId) {
                    return position;
                }
            }
            return null;
        },
        
        isPlayerInDreamTeam(playerId) {
            return this.findPlayerPosition(playerId) !== null;
        },
        
        getCompatiblePositions(playerPosition) {
            if (!playerPosition) return ['PG', 'SG', 'SF', 'PF', 'C'];
            const compatiblePositions = [];
            
            if (playerPosition.includes('G')) {
                compatiblePositions.push('PG', 'SG');
            }
            if (playerPosition.includes('F')) {
                compatiblePositions.push('SF', 'PF');
            }
            if (playerPosition.includes('C')) {
                compatiblePositions.push('C');
            }
            
            return compatiblePositions.filter(position => this[position] === null);
        },
        
        clearDreamTeam() {
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                this[position] = null;
                localStorage.removeItem(position);
            }
            
            return { success: true, message: "Dream team cleared" };
        },

        getFilledPositionCount() {
            let count = 0;
            for (const position of ['PG', 'SG', 'SF', 'PF', 'C']) {
                if (this[position] !== null) count++;
            }
            return count;
        }
    }
});
