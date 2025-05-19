<script setup>
import { useDreamTeamStore } from '../stores/dreamTeam';
import { useLogoStore } from '../stores/logoStore';
import { computed } from 'vue';

const dreamTeamStore = useDreamTeamStore();
const logoStore = useLogoStore();

const filledPositionCount = computed(() => dreamTeamStore.getFilledPositionCount());

const PG = computed(() => dreamTeamStore.PG);
const SG = computed(() => dreamTeamStore.SG);
const SF = computed(() => dreamTeamStore.SF);
const PF = computed(() => dreamTeamStore.PF);
const C = computed(() => dreamTeamStore.C);

const removePlayer = (playerId) => {
    dreamTeamStore.removePlayer(playerId);
};

const clearTeam = () => {
    if (confirm('Are you sure you want to remove all the players from your team?')) {
        dreamTeamStore.clearDreamTeam();
    }
};
</script>

<template>
    <div class="container mx-auto px-4 py-8 min-h-full">
        <h1 class="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">My Dream Team</h1>
        
        <!-- Basketball Court -->
        <div class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl my-8">
            <img 
                src="../assets/court.jpg" 
                alt="Basketball Court" 
                class="w-full h-auto"
            />
            
            <!-- Center (Top Center) -->
            <div class="absolute top-[12%] left-1/2 transform -translate-x-1/2">
                <div v-if="C" class="player-card group">
                    <!-- Remove Button - Now positioned absolutely at top-right, visible on hover -->
                    <button 
                        @click="removePlayer(C.id)"
                        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(C.team.abbreviation)" 
                            :alt="`${C.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm text-black dark:text-white">{{ C.first_name }} {{ C.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">C</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">C</span>
                </div>
            </div>
            
            <!-- Power Forward (Top Left) -->
            <div class="absolute top-[20%] left-[15%] transform -translate-x-1/2">
                <div v-if="PF" class="player-card group">
                    <!-- Remove Button -->
                    <button 
                        @click="removePlayer(PF.id)"
                        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(PF.team.abbreviation)" 
                            :alt="`${PF.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm text-black dark:text-white">{{ PF.first_name }} {{ PF.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">PF</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">PF</span>
                </div>
            </div>
            
            <!-- Small Forward (Top Right) -->
            <div class="absolute top-[20%] right-[15%] transform translate-x-1/2">
                <div v-if="SF" class="player-card group">
                    <!-- Remove Button -->
                    <button 
                        @click="removePlayer(SF.id)"
                        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(SF.team.abbreviation)" 
                            :alt="`${SF.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm text-black dark:text-white">{{ SF.first_name }} {{ SF.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">SF</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">SF</span>
                </div>
            </div>
            
            <!-- Point Guard (Bottom Left) -->
            <div class="absolute bottom-[10%] left-[27%] transform -translate-x-1/4">
                <div v-if="PG" class="player-card group">
                    <!-- Remove Button -->
                    <button 
                        @click="removePlayer(PG.id)"
                        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(PG.team.abbreviation)" 
                            :alt="`${PG.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm text-black dark:text-white">{{ PG.first_name }} {{ PG.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">PG</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">PG</span>
                </div>
            </div>
            
            <!-- Shooting Guard (Bottom Right) -->
            <div class="absolute bottom-[10%] right-[27%] transform translate-x-1/4">
                <div v-if="SG" class="player-card group">
                    <!-- Remove Button -->
                    <button 
                        @click="removePlayer(SG.id)"
                        class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-full w-24 h-24 shadow-lg overflow-hidden flex items-center justify-center relative">
                        <img 
                            :src="logoStore.getTeamLogo(SG.team.abbreviation)" 
                            :alt="`${SG.team.full_name} logo`" 
                            class="w-16 h-16 object-contain"
                        />
                    </div>
                    <div class="mt-2 text-center bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                        <p class="font-bold text-sm text-black dark:text-white">{{ SG.first_name }} {{ SG.last_name }}</p>
                        <p class="text-xs text-blue-600 font-bold">SG</p>
                    </div>
                </div>
                <div v-else class="empty-spot bg-gray-200 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center">
                    <span class="text-gray-500 dark:text-gray-400 font-bold">SG</span>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center mb-8">
            <div class="text-lg text-black dark:text-white">
                <span class="font-bold text-blue-600">{{ filledPositionCount }}/5</span> positions filled
            </div>
            <button 
                v-if="filledPositionCount > 0"
                @click="clearTeam" 
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Clear Team
            </button>
        </div>
    </div>
</template>

<style scoped>
.player-card {
    transition: all 0.3s ease;
    filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2));
    position: relative;
}

.player-card:hover {
    transform: translateY(-5px);
}

.empty-spot {
    opacity: 0.75;
    cursor: default;
    backdrop-filter: blur(2px);
}

.player-card button {
    transition: opacity 0.2s ease-in-out;
}

@media (max-width: 640px) {
    .player-position .player-card div,
    .player-position .empty-spot {
        width: 16vw;
        height: 16vw;
    }
    
    .player-card img {
        width: 10vw;
        height: 10vw;
    }
}
</style>
