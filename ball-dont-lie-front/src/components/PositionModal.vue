<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    show: Boolean,
    player: Object,
    dreamTeamStore: Object,
    availablePositions: Array
});

const emit = defineEmits(['close', 'selectPosition']);

const handleSelectPosition = (position) => {
    emit('selectPosition', props.player, position);
};

const handleClose = () => {
    emit('close');
};
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Choose position for {{ player?.first_name }} {{ player?.last_name }}
            </h3>
            
            <div v-if="availablePositions && availablePositions.length > 0" class="mb-4">
                <div class="grid grid-cols-1 gap-3">
                    <button 
                        v-for="position in availablePositions" 
                        :key="position"
                        @click="handleSelectPosition(position)"
                        class="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {{ dreamTeamStore.positionLabels[position] }}
                    </button>
                </div>
            </div>
            
            <div v-else class="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
                <p class="text-yellow-800 dark:text-yellow-200">No compatible positions available for this player.</p>
            </div>
            
            <button 
                @click="handleClose" 
                class="w-full py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
                Cancel
            </button>
        </div>
    </div>
</template>
