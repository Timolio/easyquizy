<script lang="ts" setup>
const showPopup = ref<boolean>(false);
const aMessage = ref<String>('');
const aButtons = ref<Array<Object>>([]);

const emit = defineEmits(['answer']);

const alert = (message: string, buttons: Array<string>) => {
    aMessage.value = message;
    aButtons.value = buttons;
    showPopup.value = true;
    document.body.style.overflow = 'hidden';
};

const handleClick = (bId: string) => {
    emit('answer', bId);
};

const close = () => {
    showPopup.value = false;
    document.body.style.overflow = '';
};

defineExpose({
    alert,
    close,
});
</script>

<template>
    <div v-if="showPopup" class="popup-backdrop" @click.self="close">
        <div class="popup-container">
            <div
                class="popup-content relative flex flex-col gap-6 mb-10 p-3 pt-6 m-2"
            >
                <button class="absolute right-0.5 top-0.5 close" @click="close">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"
                        />
                    </svg>
                </button>
                <h3 class="text-lg tt font-bold" v-html="aMessage"></h3>
                <div class="flex flex-col gap-3">
                    <button
                        v-for="(button, index) in aButtons"
                        :class="
                            'relative hh inline-flex flex-row items-center shadow-lg ' +
                            button?.style
                        "
                        @click="handleClick(button.id)"
                    >
                        <img
                            src="public/icon.png"
                            v-if="button?.image === 'bot'"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="absolute right-0.5 top-0.5 link"
                            viewBox="0 0 16 16"
                            v-if="button?.link"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                            />
                        </svg>
                        <div
                            :class="
                                'flex flex-col grow gap-0.5 ' +
                                button?.decoration
                            "
                        >
                            <h3 v-if="button?.title">{{ button.title }}</h3>
                            <div
                                class="font-normal text-base"
                                v-if="button?.description"
                            >
                                {{ button.description }}
                            </div>
                        </div>
                        <svg
                            tabindex="-1"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style="transform: rotate(90deg)"
                            v-if="button?.decoration !== 'centered'"
                        >
                            <path
                                d="M4 10.5L8.5 6L13 10.5"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.popup-backdrop {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* Darken the background */
    backdrop-filter: blur(5px); /* Blur effect */
    display: flex;
    align-items: flex-end; /* Show at the bottom */
}

hr {
    background: var(--tg-theme-hint-color);
    border-radius: 4px;
}

.popup-container {
    background: var(--tg-theme-section-bg-color);
    /* padding: 20px; */
    border-radius: 15px 15px 0 0;
    width: 100%;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.popup-content button.hh {
    padding: 16px 18px;
    /* background-color: var(--tg-theme-button-shadow-color2); */
    /* border: 4px solid var(--tg-theme-button-shadow-color2); */
    /* border: none; */
    border-radius: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    background-color: var(--tg-theme-button-shadow-color2);
    color: var(--tg-theme-button-light-color2);
    cursor: pointer;
    text-align: left;
    transition: all 0.1s;
}

.link {
    color: var(--tg-theme-button-light-color2);
}

.centered {
    text-align: center;
}

.close {
    color: var(--tg-theme-section-very-dark-bg-color);
}

img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}

.cancel {
    /* background-color: var(--tg-theme-shadow-destructive-text-color3) !important; */
    border-color: var(--tg-theme-shadow-destructive-text-color3) !important;
    color: var(--tg-theme-destructive-text-light-color) !important;
    background-color: var(--tg-theme-shadow-destructive-text-color3) !important;
}

.popup-content .tt {
    color: var(--tg-theme-text-color);
}

.popup-content button:active {
    transform: scale(0.975);
}
</style>
