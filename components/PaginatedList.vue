<template>
    <div class="body">
        <div class="main px-4 py-3 rounded-b-xl text-lg flex flex-col gap-2">
            <div
                class="ll py-2 px-3"
                v-for="(count, index) in paginatedResponses"
                :key="index"
            >
                <p>
                    {{ responsesKeys[startIndex + index] }}
                    <span
                        class="sp rounded-lg px-2 tg-hint inline-flex justify-center items-center"
                        v-if="count > 1"
                        ><span class="text-lg"> x</span>{{ count }}</span
                    >
                </p>
            </div>
        </div>

        <div
            v-if="totalPages > 1"
            class="w-full flex flex-row justify-between py-2 px-4"
        >
            <button @click="prevPage" :disabled="currentPage === 1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                    />
                </svg>
            </button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    responses: {
        type: Object,
        required: true,
    },
    itemsPerPage: {
        type: Number,
        default: 5,
    },
});

const currentPage = ref(1);

const responsesKeys = computed(() => Object.keys(props.responses.answers));
const totalPages = computed(() =>
    Math.ceil(responsesKeys.value.length / props.itemsPerPage)
);
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage);

const paginatedResponses = computed(() => {
    return responsesKeys.value
        .slice(startIndex.value, startIndex.value + props.itemsPerPage)
        .map(key => props.responses.answers[key]);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
</script>

<style scoped>
.body {
    background-color: var(--tg-theme-section-light-bg-color);
}

.sp {
    border: 2px solid var(--tg-theme-hint-color);
}

.ll {
    border-left: 2px solid var(--tg-theme-section-light-bg-color2);
    /* background-color: var(--tg-theme-section-light-bg-color); */
}
</style>
