<script setup>
import { usePlayerStore } from '../stores/playersStore';
import { useLogoStore } from '../stores/logoStore';
import { useDreamTeamStore } from '../stores/dreamTeam';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';

const playerStore = usePlayerStore();
const logoStore = useLogoStore();
const dreamTeamStore = useDreamTeamStore();
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);
const player = ref(null);
const notificationMessage = ref('');
const showNotification = ref(false);
const notificationClass = ref('bg-green-500');

const isInDreamTeam = computed(() => {
    if (!player.value) return false;
    return dreamTeamStore.isPlayerInDreamTeam(player.value.id);
});

const availablePositions = computed(() => {
    if (!player.value) return [];
    return dreamTeamStore.getCompatiblePositions(player.value.position);
});

const notify = (message, isSuccess = true) => {
    notificationMessage.value = message;
    notificationClass.value = isSuccess ? 'bg-green-500' : 'bg-red-500';
    showNotification.value = true;
    setTimeout(() => {
        showNotification.value = false;
    }, 3000);
};

const addToDreamTeam = (position) => {
    if (!player.value) return;
    const result = dreamTeamStore.addPlayerToPosition(player.value, position);
    notify(result.message, result.success);
};

const removeFromDreamTeam = () => {
    if (!player.value) return;
    const result = dreamTeamStore.removePlayer(player.value.id);
    notify(result.message, result.success);
};

onMounted(async () => {
    try {
        const playerId = route.params.id;
        if (!playerId) {
            error.value = 'Player ID is required';
            loading.value = false;
            return;
        }
        
        player.value = await playerStore.fetchPlayerById(playerId);
        if (!player.value) {
            error.value = 'Player not found';
        }
    } catch (err) {
        error.value = 'Failed to load player details';
        console.error('Error loading player details:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Notification -->
        <div v-if="showNotification" 
             :class="[notificationClass, 'fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity']">
            {{ notificationMessage }}
        </div>

        <div v-if="loading" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            Loading players...
        </div>

        <div v-else-if="error" class="text-center text-red-500 p-4">
            {{ error }}
        </div>

        <div v-else-if="player" class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div class="md:flex">
                    <!-- Team Logo and Player Info -->
                    <div class="md:w-1/3 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center p-6">
                        <img 
                            :src="logoStore.getTeamLogo(player.team.abbreviation)" 
                            :alt="`${player.team.full_name} logo`" 
                            class="w-48 h-48 object-contain mb-6"
                        />
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ player.team.full_name }}</h3>
                        <p class="text-gray-600 dark:text-gray-300">{{ player.team.conference }} Conference</p>
                    </div>
                    
                    <!-- Player Details -->
                    <div class="p-8 md:w-2/3">
                        <div class="flex justify-between items-start">
                            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {{ player.first_name }} {{ player.last_name }}
                            </h1>
                            <span class="bg-blue-600 text-white text-lg px-4 py-1 rounded-full">
                                {{ player.jersey_number || 'N/A' }}
                            </span>
                        </div>
                        <h2 class="text-xl text-gray-700 dark:text-gray-300 mb-6">
                            {{ player.position === 'G' ? 'Guard' : 
                               player.position === 'F' ? 'Forward' : 
                               player.position === 'C' ? 'Center' : 
                               player.position === 'G-F' ? 'Guard-Forward' :
                               player.position === 'F-C' ? 'Forward-Center' : player.position }}
                        </h2>
                        
                        <div class="grid md:grid-cols-2 gap-4 mb-6">
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Height</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ player.height || 'N/A' }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Weight</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ player.weight ? `${player.weight} lbs` : 'N/A' }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">College</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ player.college || 'N/A' }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Country</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ player.country || 'N/A' }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md col-span-2">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Draft</h3>
                                <p class="text-gray-900 dark:text-white text-lg">
                                    {{ player.draft_year ? 
                                       `${player.draft_year} Round ${player.draft_round} Pick ${player.draft_number}` : 
                                       'N/A' }}
                                </p>
                            </div>
                        </div>
                        
                        <!-- Dream Team Buttons -->
                        <div class="mt-6">
                            <div v-if="!isInDreamTeam" class="space-y-3">
                                <p class="text-gray-700 dark:text-gray-300 font-medium">Add to Dream Team as:</p>
                                <div class="flex flex-wrap gap-2">
                                    <button 
                                        v-for="position in availablePositions" 
                                        :key="position"
                                        @click="addToDreamTeam(position)"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        {{ position }}
                                    </button>
                                </div>
                            </div>
                            <button
                                v-else
                                @click="removeFromDreamTeam"
                                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Remove from Dream Team
                            </button>
                        </div>
                        
                        <!-- Navigation Buttons -->
                        <div class="flex gap-4 mt-6">
                            <router-link 
                                to="/players" 
                                class="inline-block px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Back to Players
                            </router-link>
                            <router-link 
                                :to="`/teams/${player.team.id}`"
                                class="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                View Team
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>