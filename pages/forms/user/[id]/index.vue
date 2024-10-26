<script setup lang="ts">
import { Suspense } from 'vue';
import type { FormResponse } from '~/types/form';

const { useWebApp, useWebAppBackButton, useWebAppViewport } = await import(
    'vue-tg'
);
const { initDataUnsafe } = useWebApp();
const formStore = useFormStore();
const route = useRoute();

const answers = ref({});
const formElements = ref([]);
const isLoading = ref(true);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const goHome = async () => {
    await navigateTo('/');
};

onMounted(async () => {
    isLoading.value = true;
    const res = await formStore.fetchFormById(
        route.params.id as string,
        initDataUnsafe?.user?.id ?? 404
    );

    formStore.errorCode = res;

    if (res !== 1) {
        await navigateTo(`/forms/user/${route.params.id}/completed`);
    }
    await sleep(500);

    isLoading.value = false;
    document.addEventListener('click', handleClickOutside, true);
});

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('input, textarea')) {
        document.activeElement instanceof HTMLElement &&
            document.activeElement.blur();
    }
};

const validateForm = () => {
    let isValid = true;
    let firstInvalidElement = null;
    formElements.value.forEach((el, index) => {
        const value = el.getValue();
        if (el.element.required) {
            if (!value || value.length === 0) {
                isValid = false;
                if (!firstInvalidElement) {
                    firstInvalidElement = el.$el;
                }
            }
        }
    });
    if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }

    return isValid;
};

const collectValues = async () => {
    if (!validateForm()) {
        console.log('Form is not valid');
        return;
    }
    formElements.value.forEach(el => {
        answers.value[el.element.id] = el.getValue();
    });
    const answer = {
        form_id: formStore.currentForm?._id ?? '',
        owner_id: initDataUnsafe?.user?.id ?? 404,
        answers: answers.value,
    };
    const { success } = await formStore.submitResponse(answer);
    if (success) {
        await navigateTo(`/forms/user/${route.params.id}/completed`);
    }
};

useWebAppBackButton().hideBackButton();
useWebAppViewport().disableVerticalSwipes();
useWebAppViewport().expand();
</script>

<template>
    <div v-if="isLoading" class="w-full flex flex-col gap-4">
        <div class="tg-dark-element rounded-xl px-7 py-6">
            <div role="status" class="w-full p-2">
                <div class="h-4 w-4/5 mb-2 shimmer"></div>
                <span class="sr-only">Loading...</span>
            </div>
            <div role="status" class="w-full p-2">
                <div class="h-2 w-full mb-2.5 shimmer"></div>
                <div class="h-2 w-full mb-2.5 shimmer"></div>
                <div class="h-2 w-full mb-2.5 shimmer"></div>
                <div class="h-2 w-full shimmer"></div>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
    <div v-else-if="formStore.currentForm !== null" class="w-full">
        <div class="tg-element rounded-xl mb-4">
            <div class="px-6 py-5 header rounded-b-xl">
                <p class="text-3xl w-full">
                    {{ formStore.currentForm.title }}
                </p>
                <p
                    v-if="formStore.currentForm.description"
                    class="w-full text-lg mt-4"
                >
                    {{ formStore.currentForm.description }}
                </p>
            </div>
            <!-- <div class="px-4 py-3 body">
                <button
                    @click="e => e.target?.classList.toggle('active')"
                    class="tg-link font-bold"
                >
                    {{ initDataUnsafe?.user?.username ?? '@timolio' }}
                </button>
            </div> -->
        </div>
        <div class="flex flex-col gap-4">
            <FormElement
                v-for="(element, index) in formStore.currentForm?.elements"
                :key="index"
                :element="element"
                :elementId="index"
                :showControls="false"
                ref="formElements"
            />
            <button
                @click.prevent="collectValues"
                class="relative inline-flex w-full items-center justify-center tg-button p-1 overflow-hidden text-lg font-medium rounded-xl group"
            >
                <span
                    class="relative w-full px-5 py-2 group-hover:bg-opacity-0 rounded-lg"
                >
                    Отправить
                </span>
            </button>
        </div>
    </div>
</template>
