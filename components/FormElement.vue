<template>
    <div
        class="tg-element rounded-xl rounded relative flex flex-col"
        @touchstart="handleClick"
        @mousedown="handleClick"
    >
        <div class="main rounded-b-xl">
            <div class="header px-6 py-5 rounded-b-xl">
                <p class="text-xl break-words">
                    {{ element.title
                    }}<span v-if="element.required" class="required"> *</span>
                </p>
                <p v-if="element.description" class="text-lg mt-1 break-words">
                    {{ element.description }}
                </p>
            </div>
            <div class="body px-6 pt-5 pb-6">
                <!-- <div v-if="element.type === 'rank-multiple'">
                    <div class="flex flex-col gap-3">
                        <label
                            v-for="(option, index) in element.options"
                            :key="option"
                            :class="
                                'flex flex-row p-1 box-border items-center justify-between rounded-xl rank-item ' +
                                String(isSelected(option)) +
                                'selecteditem'
                            "
                            :for="'cb-' + elementId + index"
                        >
                            <div
                                class="flex flex-row items-center grow rank-option pl-3"
                            >
                                <input
                                    type="checkbox"
                                    :id="'cb-' + elementId + index"
                                    :value="option"
                                    @change="toggleSelection(option)"
                                    class="grow-0 shrink-0 mr-4"
                                />
                                <span class="text-lg grow my-1">
                                    {{ option }}
                                </span>
                            </div>
                            <div
                                :class="
                                    'rank-number grow-0 size-12 text-2xl flex shrink-0 justify-center items-center ' +
                                    String(isSelected(option)) +
                                    'selected'
                                "
                            >
                                {{
                                    isSelected(option)
                                        ? value.indexOf(option) + 1
                                        : '#'
                                }}
                            </div>
                        </label>
                    </div>
                </div> -->
                <div>
                    <div
                        class="flex flex-col gap-1"
                        v-if="element.type === 'one'"
                    >
                        <div
                            v-for="(option, index) in element.options"
                            :key="option"
                            class="radio-wrapper"
                        >
                            <input
                                type="radio"
                                :name="'single-choice-' + elementId"
                                :id="'cb-' + elementId + index"
                                :value="option"
                                @click="toggleRadio(option)"
                                :checked="isSelectedRadio(option)"
                            />
                            <label
                                class="text-lg"
                                :for="'cb-' + elementId + index"
                            >
                                {{ option }}
                            </label>
                        </div>
                    </div>
                    <div
                        class="flex flex-col gap-1"
                        v-if="element.type === 'multiple'"
                    >
                        <div
                            class="checkbox-wrapper"
                            v-for="(option, index) in element.options"
                            :key="option"
                        >
                            <input
                                type="checkbox"
                                :name="'multiple-choice-' + elementId"
                                :id="'cb-' + elementId + index"
                                v-model="value"
                                :value="option"
                            />
                            <label
                                class="text-lg break-words"
                                :for="'cb-' + elementId + index"
                            >
                                <!-- <div class="cb-text text-lg"> -->
                                {{ option }}
                                <!-- </div> -->
                            </label>
                        </div>
                    </div>
                    <div v-if="element.type === 'text-short'">
                        <input
                            type="text"
                            placeholder="Краткий ответ"
                            class="tg-input text-lg pb-1 w-full"
                            @keydown.enter.prevent
                            v-model="value"
                        />
                    </div>
                    <div v-if="element.type === 'text-long'">
                        <textarea
                            placeholder="Развёрнутый ответ"
                            class="tg-input text-lg pb-1 w-full"
                            rows="1"
                            oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                            v-model="value"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showControls" class="footer flex flex-row-reverse p-2">
            <div
                class="tg-faint-button drag-handle mr-2 flex items-center justify-center rounded-lg shrink-0 size-10"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"
                    />
                </svg>
            </div>
            <button
                class="tg-destructive-button mr-2 flex items-center justify-center rounded-lg shrink-0 size-10"
                @click="deleteElement"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                    />
                </svg>
            </button>
            <button
                class="tg-button mr-2 flex items-center justify-center rounded-lg shrink-0 size-10"
                @click="editElement"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    element: Object,
    elementId: Number,
    showControls: Boolean,
});

const value = ref([]);
const selectedRadio = ref(null);

const emit = defineEmits(['edit', 'delete', 'activated']);

const toggleSelection = option => {
    const index = value.value.indexOf(option);
    if (index === -1) {
        // Добавляем элемент в список, если он не выбран
        value.value.push(option);
    } else {
        // Удаляем элемент, если он был выбран ранее
        value.value.splice(index, 1);
    }
    console.log(value.value);
};

// const isSelected = option => {
//     return value.value.includes(option);
// };

const toggleRadio = option => {
    if (selectedRadio.value === option) {
        selectedRadio.value = null;
        value.value = [];
    } else {
        selectedRadio.value = option;
        value.value = [option];
    }
};

const isSelectedRadio = option => {
    return selectedRadio.value === option;
};

const getValue = () => {
    return value.value;
};

const editElement = () => {
    emit('edit', props.elementId);
};

const handleClick = () => {
    emit('activated', props.element.id);
};

const deleteElement = () => {
    emit('delete', props.elementId);
};

defineExpose({
    getValue,
    element: props.element,
});
</script>

<style scoped>
/* .rank-number {
    font-size: 1.2em;
    font-weight: bold;
    border: 3px solid #ddd;
    padding: 5px;
    border-radius: 5px;
    min-width: 30px;
    text-align: center;
    flex-shrink: 0;
}

.rank-option {
    border: 3px solid var(--tg-theme-button-color);
} */

h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.rank-item input[type='checkbox'] {
    /* width: 20px;
    height: 20px;
    background: none; */
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.rank-item {
    border: 2px solid var(--tg-theme-hint-color);
    cursor: pointer;
}

.falseselected {
    color: var(--tg-theme-hint-color);
}

.trueselecteditem {
    background-color: var(--tg-theme-button-color);
    border-color: var(--tg-theme-button-color);
    box-shadow: 0 10px 15px -3px var(--tg-theme-button-shadow-color),
        0 4px 6px -4px var(--tg-theme-button-shadow-color);
}

.trueselected {
    color: var(--tg-theme-text-color);
    font-weight: bold;
    font-size: 2.25rem;
}

/* .rank-number {
    flex-shrink: 0;
    font-size: 2rem;
    font-weight: bold;
    color: var(--tg-theme-hint-color);
    border: 3px solid var(--tg-theme-hint-color);
    border-radius: 0.4rem;
}

.rank-option {
    border: 3px solid var(--tg-theme-button-color);
    min-height: 4rem;
    border-radius: 0.4rem;
} */
</style>
