<script setup>
import NavBar from './components/NavBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
    <div class="min-h-screen flex flex-col dark:bg-gray-900">
        <NavBar />
        <main class="flex-grow pt-20">
            <router-view /> 
        </main>
    </div>
</template>

