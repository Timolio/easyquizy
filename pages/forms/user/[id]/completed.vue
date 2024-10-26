<template>
    <div class="w-full">
        <div class="tg-element form-header rounded-xl">
            <div class="px-6 py-5">
                <div
                    v-if="
                        formStore.errorCode === 2 || formStore.errorCode === 405
                    "
                    class="flex flex-col w-full items-center text-center justify-center p-10"
                >
                    <p class="tg-text text-4xl">СПАСИБО</p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        class="heart mt-2"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                        />
                    </svg>
                </div>
                <div
                    v-else-if="formStore.errorCode === 404"
                    class="flex flex-col w-full items-center text-center justify-center p-10"
                >
                    <p class="tg-text text-4xl">ФОРМА ЗАКРЫТА</p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="currentColor"
                        class="lock mt-2"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"
                        />
                    </svg>
                </div>
            </div>
            <hr />
            <button
                class="relative inline-flex w-full items-center justify-center tg-button p-1 text-lg font-medium rounded-xl group"
                @click="goHome"
            >
                <span
                    class="relative w-full px-5 py-2 tg-button-span rounded-lg"
                >
                    На главную страницу
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { onMounted } from 'vue';
const { useWebAppBackButton, useWebAppViewport, useWebApp } = await import(
    'vue-tg'
);

const formStore = useFormStore();
const router = useRouter();
const route = useRoute();
const { initDataUnsafe } = useWebApp();

const again = async () => {
    await router.push(`/forms/user/${route.params.id}`);
};

const goHome = async () => {
    initDataUnsafe.start_param = '';
    await navigateTo('/');
};

onMounted(() => {
    if (formStore.errorCode === 1 || formStore.errorCode === 0) {
        router.push(`/forms/user/${route.params.id}`);
    }
});

useWebAppBackButton().hideBackButton();
useWebAppViewport().disableVerticalSwipes();
useWebAppViewport().expand();
</script>

<style scoped>
.tg-text {
    color: var(--tg-theme-text-color);
}

/* .tg-element {
    background-image: linear-gradient(
        to bottom right,
        var(--tg-theme-section-dark-bg-color) 50%,
        var(--tg-theme-section-light-bg-color) 100%
    );
} */

.tg-button {
    box-shadow: none;
    background-image: none;
    background-color: var(--tg-theme-section-dark-bg-color);
}

hr {
    height: 2px;
    background-color: var(--tg-theme-button-color);
}

.tg-button-span {
    background-color: var(--tg-theme-section-dark-bg-color);
    color: var(--tg-theme-button-color);
    /* color: var(--tg-theme-subtitle-text-color); */
}

.heart {
    color: var(--tg-theme-destructive-text-color);
    animation: pulse 1s infinite;
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
}
.lock {
    color: var(--tg-theme-destructive-text-color);
    animation: tilt-shaking 0.3s infinite;
    @keyframes tilt-shaking {
        0% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(5deg);
        }
        50% {
            transform: rotate(0eg);
        }
        75% {
            transform: rotate(-5deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }
}
</style>
