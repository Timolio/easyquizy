<template>
    <div class="top-list">
        <div v-for="(item, index) in sortedItems" :key="index" class="top-item">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-average">
                <span class="text-xl tg-hint">#</span
                >{{ item.average.toFixed(2) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// Получаем пропс
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const sortedItems = computed(() => {
    const itemsArray = [];

    if (props.data.answers && props.data.total > 0) {
        Object.entries(props.data.answers).forEach(([name, sum]) => {
            const average = sum / props.data.total;
            itemsArray.push({ name, average });
        });
    }

    return itemsArray.sort((a, b) => a.average - b.average);
});
</script>

<style scoped>
.top-list {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.top-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border: 2px solid var(--tg-theme-hint-color);
    border-radius: 0.75rem;
    background-color: none;
    color: white;
}

.item-name {
    font-size: 1.125rem;
}

.item-average {
    font-size: 1.5rem;
    font-weight: bold;
}
</style>
