<template>
    <div
        class="fixed bottom-0 left-1/2 transform hotbar -translate-x-1/2 pb-6 p-2 flex flex-row z-50 pointer-events-none rounded-t-xl gap-2 justify-center"
    >
        <div class="flex flex-row p-2 rounded-2xl gap-2 buttons-wrapper">
            <!-- <button
            class="grow-0 flex hotbarbutton items-center justify-center rounded-xl shrink-0 size-16"
            @click="goHome"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
            >
                <path
                    d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"
                />
                <path
                    d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"
                />
            </svg>
        </button> -->

            <button
                class="grow-0 flex hotbarbutton h-po items-center justify-center rounded-xl shrink-0 size-16"
                @click="share"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"
                    />
                </svg>
            </button>
            <button
                class="grow-0 flex hotbarbutton addbutton items-center justify-center rounded-xl shrink-0 size-16"
                @click="openPopup"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                    />
                </svg>
            </button>
            <a
                class="grow-0 flex hotbarbutton h-po items-center justify-center rounded-xl shrink-0 size-16"
                :href="route.hash === '' ? '#responses' : '#'"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"
                    />
                </svg>
            </a>
        </div>
    </div>
    <div v-if="showPopup" class="popup-backdrop" @click.self="closePopup">
        <div class="popup-container">
            <div
                class="popup-content relative flex flex-col gap-6 mb-10 p-3 pt-6 m-2"
            >
                <button
                    class="absolute right-0.5 top-0.5 close"
                    @click="closePopup"
                >
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
                <h3 class="text-lg font-bold tt">{{ $t('choose') }}</h3>
                <div class="flex flex-col gap-2">
                    <button
                        v-for="type in types"
                        class="inline-flex tt flex-row gap-3 items-center shadow-lg"
                        @click="selectItem(type)"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="36"
                            height="36"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path :fill-rule="type?.rule" :d="type.icon" />
                        </svg>
                        <div class="flex flex-col gap-0.5 grow">
                            <h3>{{ type.title }}</h3>
                            <div class="font-normal text-base">
                                {{ type.description }}
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

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useWebAppNavigation } from 'vue-tg';
import { useFormStore } from '~/stores/form';

const { t } = useI18n();

const formStore = useFormStore();
const showPopup = ref(false);
const route = useRoute();
const Navi = useWebAppNavigation();

const copySuccess = ref(false);
const successMessage = 'Ссылка скопирована в буфер обмена!';

const emit = defineEmits(['newEl', 'linkCopied']);
const types = [
    {
        title: t('one_title'),
        description: t('one_desc'),
        type: 'one',
        id: 'one',
        icon: 'M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0m7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3',
    },
    {
        title: t('mtl_title'),
        description: t('mtl_desc'),
        type: 'multiple',
        id: 'mtl',
        icon: 'M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM2 1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm.854-3.646a.5.5 0 0 1-.708 0l-1-1a.5.5 0 1 1 .708-.708l.646.647 1.646-1.647a.5.5 0 1 1 .708.708zm0 8a.5.5 0 0 1-.708 0l-1-1a.5.5 0 0 1 .708-.708l.646.647 1.646-1.647a.5.5 0 0 1 .708.708zM7 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5',
    },
    {
        title: t('txs_title'),
        description: t('txs_desc'),
        type: 'text-short',
        id: 'txs',
        icon: 'M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5',
        rule: 'evenodd',
    },
    {
        title: t('txl_title'),
        description: t('txl_desc'),
        type: 'text-long',
        id: 'txl',
        icon: 'M0 .5A.5.5 0 0 1 .5 0h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 0 .5m0 2A.5.5 0 0 1 .5 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m9 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-9 2A.5.5 0 0 1 .5 4h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m5 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-12 2A.5.5 0 0 1 .5 6h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-8 2A.5.5 0 0 1 .5 8h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-7 2a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5',
        rule: 'evenodd',
    },
    // {
    //     title: 'Рейтинг',
    //     description: 'Составить рейтинг из вариантов',
    //     type: 'rank-multiple',
    //     id: 'rml',
    // },
];

async function goHome() {
    await navigateTo('/');
}

const openPopup = () => {
    showPopup.value = true;
    document.body.style.overflow = 'hidden'; // Disable background scroll
};

const closePopup = () => {
    showPopup.value = false;
    document.body.style.overflow = ''; // Re-enable scroll
};

const copyLink = () => {
    const link = `t.me/easy_quizy_bot/easyquizy?startapp=${route.params.id}`;

    // if (navigator.clipboard) {
    //     navigator.clipboard
    //         .writeText(link)
    //         .then(() => {
    //             copySuccess.value = true;
    //             setTimeout(() => {
    //                 copySuccess.value = false;
    //             }, 2000);
    //         })
    //         .catch(err => {
    //             console.error('Не удалось скопировать текст: ', err);
    //         })
    // }
    Navi.openTelegramLink(
        `https://t.me/share/url?url=${link}&text=Я создал опрос в @easy_quizy_bot. Можешь пройти его, пожалуйста?`
    );

    // emit('linkCopied');
};

const share = async () => {
    // navigateTo(`/forms/user/${route.params.id}`);
    copyLink();
};

const selectItem = type => {
    const element = {
        id: type.id + uuidv4(),
        type: type.type,
        title: 'Новый элемент',
        description: '',
        required: true,
        options: [],
    };
    if (type === 'one' || type === 'multiple') {
        element.options = ['Вариант 1'];
    } else if (type === 'range') {
        element.options = {
            min: 1,
            max: 10,
            step: 1,
        };
    }
    console.log(element.options);
    const id = formStore.addElement(element);
    closePopup();
    emit('newEl', id, true);
};

defineExpose({
    showPopup,
    closePopup,
});
</script>

<style scoped>
button {
    pointer-events: auto;
}

a {
    pointer-events: auto;
}

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

.popup-container {
    background: var(--tg-theme-section-bg-color);
    border-radius: 15px 15px 0 0;
    width: 100%;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.close {
    color: var(--tg-theme-section-very-dark-bg-color);
}

.popup-content button.tt {
    padding: 16px 18px;
    background-color: var(--tg-theme-button-shadow-color2);
    border: none;
    border-radius: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--tg-theme-button-light-color2);
    cursor: pointer;
    text-align: left;
    transition: all 0.1s;
}

.popup-content .tt {
    color: var(--tg-theme-text-color);
}

.popup-content button:active {
    transform: scale(0.975);
}
</style>
