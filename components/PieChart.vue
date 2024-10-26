<script setup lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    type ChartOptions,
} from 'chart.js';
import { Pie } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels, Title, Tooltip, Legend, ArcElement);

const root = document.documentElement;
const style = window.getComputedStyle(root);

const props = defineProps<{
    data: Record<string, number>;
}>();

const chartData = ref({
    labels: Object.keys(props.data.answers),
    datasets: [
        {
            data: Object.values(props.data.answers),
            backgroundColor: [
                '#0099c5',
                '#dd4578',
                '#109619',
                '#dc3812',
                '#673bb7',
                '#fe9900',
            ],
        },
    ],
});

const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                color: style.getPropertyValue('--tg-theme-text-color'),
                usePointStyle: true,
                font: {
                    size: 16,
                },
            },
        },
        datalabels: {
            color: style.getPropertyValue('--tg-theme-text-color'),
            font: {
                size: 16,
            },
            formatter: (value, context) => {
                const dataset = context.chart.data.datasets[0];
                const total = dataset.data.reduce((sum, val) => sum + val, 0);
                const percentage = ((value / total) * 100).toFixed(1) + '%';
                return percentage;
            },
        },
    },
    elements: {
        arc: {
            borderWidth: 0,
            borderColor: style.getPropertyValue(
                '--tg-theme-secondary-bg-color'
            ),
        },
    },
};

watch(
    () => props.data,
    newData => {
        chartData.value = {
            labels: Object.keys(newData.answers),
            datasets: [
                {
                    data: Object.values(newData.answers),
                    backgroundColor: [
                        '#0099c5',
                        '#dd4578',
                        '#109619',
                        '#dc3812',
                        '#673bb7',
                        '#fe9900',
                    ],
                },
            ],
        };
    },
    { deep: true }
);
</script>

<template>
    <div>
        <Pie ref="" :data="chartData" :options="chartOptions" />
    </div>
</template>

<style scoped>
div {
    position: relative;
    height: 300px;
    width: 100%;
}
</style>
