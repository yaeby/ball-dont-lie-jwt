<script setup>
import { ref } from 'vue';

const features = ref([
    {
        title: "Search Players & Teams",
        description: "Look up your favorite NBA players and teams to see their detailed information.",
        icon: "search"
    },
    {
        title: "View Stats",
        description: "Access comprehensive statistics for players and teams throughout the season.",
        icon: "chart-bar"
    },
    {
        title: "Create Your Dream Team",
        description: "Add favorite players to build your personal dream team collection.",
        icon: "users"
    }
]);
</script>

<template>
    <div class="container mx-auto px-4 py-16">

        <section class="bg-gradient-to-r from-blue-900 to-red-900 dark:from-blue-950 dark:to-black rounded-lg shadow-xl mb-12 text-white">
            <div class="px-6 py-16 text-center">
                <h1 class="text-5xl font-bold mb-4">Ball Don't Lie</h1>
                <p class="text-xl mb-8 text-gray-300">Your complete NBA stats and player management platform</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <router-link to="/players" class="px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition duration-300 transform hover:-translate-y-1">
                        Explore Players
                    </router-link>
                    <router-link to="/teams" class="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:bg-opacity-10 transition duration-300 transform hover:-translate-y-1">
                        Browse Teams
                    </router-link>
                </div>
            </div>
        </section>

        <section class="mb-12">
            <h2 class="text-3xl font-bold mb-8 text-center text-black dark:text-white">What You Can Do</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="(feature, index) in features" :key="index" 
                     class="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div class="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="feature.icon === 'search'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            <path v-if="feature.icon === 'chart-bar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            <path v-if="feature.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">{{ feature.title }}</h3>
                    <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
                </div>
            </div>
        </section>

        <section class="bg-white dark:bg-gray-950 rounded-lg p-8 text-center shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-black dark:text-white">Get Started</h2>
            <p class="text-gray-600 dark:text-gray-300">
                Ready to dive in? Explore teams, find players, create your perfect team with your favorite players!
            </p>
        </section>
    </div>
</template>