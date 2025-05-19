<script setup>
import { useTeamStore } from '../stores/teamStore';
import { useLogoStore } from '../stores/logoStore';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const teamStore = useTeamStore();
const logoStore = useLogoStore();
const route = useRoute();
const loading = ref(true);
const error = ref(null);
const team = ref(null);

onMounted(async () => {
    try {
        const teamId = route.params.id;
        if (!teamId) {
            error.value = 'Team ID is required';
            loading.value = false;
            return;
        }
        
        team.value = await teamStore.fetchTeamById(teamId);
        if (!team.value) {
            error.value = 'Team not found';
        }
    } catch (err) {
        error.value = 'Failed to load team details';
        console.error('Error loading team details:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="loading" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            Loading players...
        </div>

        <div v-else-if="error" class="text-center text-red-500 p-4">
            {{ error }}
        </div>

        <div v-else-if="team" class="max-w-4xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div class="md:flex">
                    <!-- Team Logo -->
                    <div class="md:w-1/3 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8">
                        <img 
                            :src="logoStore.getTeamLogo(team.abbreviation)" 
                            :alt="`${team.full_name} logo`" 
                            class="w-48 h-48 object-contain"
                        />
                    </div>
                    
                    <!-- Team Details -->
                    <div class="p-8 md:w-2/3">
                        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ team.full_name }}
                        </h1>
                        <h2 class="text-xl text-gray-700 dark:text-gray-300 mb-4">
                            {{ team.city }}, {{ team.conference === 'East' ? 'Eastern' : 'Western' }} Conference
                        </h2>
                        
                        <div class="grid md:grid-cols-2 gap-4 mb-6">
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Abbreviation</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ team.abbreviation }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Division</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ team.division }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Conference</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ team.conference }}</p>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <h3 class="font-semibold text-gray-700 dark:text-gray-300">Name</h3>
                                <p class="text-gray-900 dark:text-white text-lg">{{ team.name }}</p>
                            </div>
                        </div>
                        
                        <!-- Back Button -->
                        <router-link 
                            to="/teams" 
                            class="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4"
                        >
                            Back to Teams
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>