<script setup>
import { ref, onMounted, computed } from 'vue';
import { useProspectsStore } from '../stores/prospectsStore';
import ProspectModal from '../components/ProspectModal.vue';

const prospectsStore = useProspectsStore();
const loading = ref(true);
const error = ref(null);
const notificationMessage = ref('');
const showNotification = ref(false);
const notificationClass = ref('bg-green-500');
const searchQuery = ref('');

const showProspectModal = ref(false);
const selectedProspect = ref(null);
const isEditingProspect = ref(false);

const notify = (message, isSuccess = true) => {
    notificationMessage.value = message;
    notificationClass.value = isSuccess ? 'bg-green-500' : 'bg-red-500';
    showNotification.value = true;
    setTimeout(() => {
        showNotification.value = false;
    }, 3000);
};

const openCreateModal = () => {
    selectedProspect.value = null;
    isEditingProspect.value = false;
    showProspectModal.value = true;
};

const openEditModal = (prospect) => {
    selectedProspect.value = prospect;
    isEditingProspect.value = true;
    showProspectModal.value = true;
};

const closeModal = () => {
    showProspectModal.value = false;
    selectedProspect.value = null;
};

const handleSaveProspect = async (prospectData) => {
    let result;

    if (isEditingProspect.value) {
        result = await prospectsStore.updateProspect(prospectData.id, prospectData);
    } else {
        result = await prospectsStore.createProspect(prospectData);
    }

    notify(result.message, result.success);

    if (result.success) {
        closeModal();
    }
};

const handleDeleteProspect = async (id) => {
    if (confirm('Are you sure you want to delete this prospect?')) {
        const result = await prospectsStore.deleteProspect(id);
        notify(result.message, result.success);
    }
};

const filteredProspects = computed(() => {
    if (!searchQuery.value) return prospectsStore.prospects;

    const query = searchQuery.value.toLowerCase();
    return prospectsStore.prospects.filter(prospect =>
        prospect.firstName?.toLowerCase().includes(query) ||
        prospect.lastName?.toLowerCase().includes(query) ||
        prospect.college?.toLowerCase().includes(query) ||
        prospect.country?.toLowerCase().includes(query)
    );
});

const currentPage = computed(() => prospectsStore.pagination.currentPage + 1);
const totalPages = computed(() => prospectsStore.pagination.totalPages);

const nextPage = async () => {
    if (prospectsStore.hasNext) {
        await prospectsStore.nextPage();
    }
};

const prevPage = async () => {
    if (prospectsStore.hasPrevious) {
        await prospectsStore.prevPage();
    }
};

onMounted(async () => {
    try {
        await prospectsStore.fetchProspects();
        error.value = prospectsStore.error;
    } catch (err) {
        error.value = 'Failed to load prospects data';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="showNotification"
             :class="[notificationClass, 'fixed top-4 right-4 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity']">
            {{ notificationMessage }}
        </div>

        <ProspectModal
            :show="showProspectModal"
            :prospect="selectedProspect"
            :isEditing="isEditingProspect"
            @close="closeModal"
            @save="handleSaveProspect"
        />

        <div class="mb-8 flex flex-col md:flex-row justify-between items-center">
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">NBA Draft Prospects</h1>

            <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div class="relative">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search prospects..."
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    />
                </div>

                <button
                    @click="openCreateModal"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add New Prospect
                </button>
            </div>
        </div>

        <div v-if="loading" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            Loading prospects...
        </div>

        <div v-else-if="error" class="text-center text-red-500 p-4">
            {{ error }}
        </div>

        <div v-else-if="filteredProspects.length === 0" class="text-center text-xl text-gray-600 dark:text-gray-300 py-12">
            No prospects found. Add one to get started!
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
                v-for="prospect in filteredProspects"
                :key="prospect.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
                <div class="flex justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                </div>

                <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white text-center">
                    {{ prospect.firstName }} {{ prospect.lastName }}
                </h2>

                <div class="text-gray-600 dark:text-gray-300 text-center">
                    <p class="mb-2" v-if="prospect.position">Position: {{ prospect.position }}</p>
                    <p class="mb-2" v-if="prospect.height">Height: {{ prospect.height }}"</p>
                    <p class="mb-2" v-if="prospect.weight">Weight: {{ prospect.weight }} lbs</p>
                    <p class="mb-2" v-if="prospect.college">College: {{ prospect.college }}</p>
                    <p class="mb-2" v-if="prospect.country">Country: {{ prospect.country }}</p>
                    <p class="mb-2" v-if="prospect.jerseyNumber">Jersey: {{ prospect.jerseyNumber }}</p>
                </div>

                <div class="flex justify-center gap-4 mt-6">
                    <button
                        @click="openEditModal(prospect)"
                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        @click="handleDeleteProspect(prospect.id)"
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <div v-if="filteredProspects.length > 0" class="mt-8">
            <!-- Pagination Controls -->
            <div class="flex justify-between items-center">
                <button 
                    @click="prevPage"
                    :disabled="!prospectsStore.hasPrevious"
                    class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    Previous
                </button>

                <span class="text-gray-800 dark:text-white">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>

                <button 
                    @click="nextPage"
                    :disabled="!prospectsStore.hasNext"
                    class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>