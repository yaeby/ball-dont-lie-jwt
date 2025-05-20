<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    prospect: Object,
    isEditing: Boolean
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
    firstName: '',
    lastName: '',
    position: '',
    height: '',
    weight: '',
    jerseyNumber: '',
    college: '',
    country: ''
});

const positions = ['G', 'F', 'C', 'G-F', 'F-C'];

const resetForm = () => {
    formData.value = {
        firstName: '',
        lastName: '',
        position: '',
        height: '',
        weight: '',
        jerseyNumber: '',
        college: '',
        country: ''
    };
};

const handleClose = () => {
    resetForm();
    emit('close');
};

const handleSave = () => {
    const prospectData = {
        id: props.isEditing ? props.prospect.id : null,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        position: formData.value.position,
        height: formData.value.height,
        weight: formData.value.weight,
        jerseyNumber: formData.value.jerseyNumber,
        college: formData.value.college,
        country: formData.value.country
    };
    
    emit('save', prospectData);
};

watch(() => props.prospect, (newProspect) => {
    if (newProspect && props.isEditing) {
        formData.value = {
            firstName: newProspect.firstName || '',
            lastName: newProspect.lastName || '',
            position: newProspect.position || '',
            height: newProspect.height || '',
            weight: newProspect.weight || '',
            jerseyNumber: newProspect.jerseyNumber || '',
            college: newProspect.college || '',
            country: newProspect.country || ''
        };
    } else {
        resetForm();
    }
}, { immediate: true });
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {{ isEditing ? 'Edit Prospect' : 'Add New Prospect' }}
            </h3>
            
            <form @submit.prevent="handleSave" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                        <input 
                            v-model="formData.firstName" 
                            type="text" 
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                        <input 
                            v-model="formData.lastName" 
                            type="text" 
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                    <select 
                        v-model="formData.position" 
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                    >
                        <option value="" disabled>Select position</option>
                        <option v-for="position in positions" :key="position" :value="position">
                            {{ position }}
                        </option>
                    </select>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (in)</label>
                        <input 
                            v-model="formData.height" 
                            type="number" 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (lbs)</label>
                        <input 
                            v-model="formData.weight" 
                            type="number" 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                        >
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jersey Number</label>
                    <input 
                        v-model="formData.jerseyNumber" 
                        type="text" 
                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                    >
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">College</label>
                    <input 
                        v-model="formData.college" 
                        type="text" 
                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                    >
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                    <input 
                        v-model="formData.country" 
                        type="text" 
                        class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-700 dark:text-white"
                    >
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                    <button 
                        type="button" 
                        @click="handleClose"
                        class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {{ isEditing ? 'Update' : 'Create' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>