<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTeamStore } from '../stores/teamStore';
import { useLogoStore } from '../stores/logoStore';

const teamStore = useTeamStore();
const logoStore = useLogoStore();
const router = useRouter();
const loading = ref(true);

onMounted(async () => {
    if (teamStore.teams.length === 0) {
        await teamStore.fetchTeams();
    }
    loading.value = false;
});

const teams = computed(() => teamStore.teams);

function goToTeamDetails(teamId) {
    router.push(`/teams/${teamId}`);
}
</script>

<template>
    <div class="container mx-auto px-4 py-16">
        <h1 class="text-3xl font-bold mb-8 text-center text-black dark:text-white">NBA Teams</h1>
        
        <div v-if="loading" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            Loading teams...
        </div>
        
        <div v-else-if="teams.length === 0" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            No teams found.
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
                v-for="team in teams" 
                :key="team.id" 
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                @click="goToTeamDetails(team.id)"
            >
                <img 
                    :src="logoStore.getTeamLogo(team.abbreviation)" 
                    :alt="`${team.full_name} logo`" 
                    class="h-32 w-32 mx-auto mb-4 object-contain"
                />
                <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white text-center">{{ team.full_name }}</h2>
                <div class="text-gray-600 dark:text-gray-300 text-center">
                    <p class="mb-2"><span class="font-semibold">Abbreviation:</span> {{ team.abbreviation }}</p>
                    <p class="mb-2"><span class="font-semibold">City:</span> {{ team.city }}</p>
                    <p class="mb-2"><span class="font-semibold">Conference:</span> {{ team.conference }}</p>
                    <p><span class="font-semibold">Division:</span> {{ team.division }}</p>
                </div>
            </div>
        </div>
    </div>
</template>