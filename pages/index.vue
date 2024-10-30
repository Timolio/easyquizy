<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useFormStore } from '#imports';
const {
    useWebApp,
    useWebAppBackButton,
    useWebAppViewport,
    useWebAppNavigation,
} = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const route = useRoute();
const formStore = useFormStore();
const isLoading = ref(true);
const hideAll = ref(false);
const startapp = ref('');
const showPopup = ref(false);
const alerter = ref();
const { locale, setLocale, t } = useI18n();
const validUser = ref(false);

const checkUser = async () => {
    try {
        const response = await $fetch(
            `/api/checkUser?userId=${initDataUnsafe?.user?.id}`
        );
        validUser.value = response.exists;
        return response.exists;
    } catch (error) {
        console.error('User not found', error);
        return false;
    }
};

const handleAlert = (bId: string) => {
    if (bId === 'openbot') {
        useWebAppNavigation().openTelegramLink('https://t.me/easy_quizy_bot');
        alerter.value.close();
    }
};

const openPopup = async () => {
    // if (!validUser.value) {
    //     await checkUser();
    // }
    // if (!validUser.value) {
    //     alerter.value.alert(t('launch_bot'), [
    //         {
    //             id: 'openbot',
    //             title: '@easy_quizy_bot',
    //             decoration: 'centered',
    //             image: 'bot',
    //             link: true,
    //         },
    //     ]);
    //     return;
    // }
    showPopup.value = true;
    document.body.style.overflow = 'hidden';
};

const closePopup = () => {
    showPopup.value = false;
    document.body.style.overflow = '';
};

const createSurveyForm = async () => {
    const form = {
        title: 'Новая форма',
        description: 'Описание формы',
        onetime: false,
        open: true,
        elements: [
            {
                id: uuidv4(),
                title: 'Приём?',
                description:
                    'Это элемент-пример. Можешь удалить, изменять его или создавать новые.',
                type: 'one',
                required: true,
                options: [
                    'Вариант 1',
                    'Вариант 2',
                    'Вариант 3',
                    'Вариант 4',
                    'Другой вариант',
                ],
            },
        ],
    };

    const uid = initDataUnsafe?.user?.id ?? 303;
    const formId = await formStore.createForm(form, uid);
    await navigateTo(`/forms/user/${formId}/update`);
    closePopup();
};

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    isLoading.value = true;
    // if (!initDataUnsafe.user?.id) {
    //     console.log('No user ID provided.');
    //     return;
    // }
    let lang = initDataUnsafe?.user?.language_code;
    const ru_langs = new Set([
        'be',
        'hy',
        'kk',
        'uz',
        'tk',
        'sah',
        'az',
        'ba',
        'ky',
    ]);

    if (ru_langs.has(lang)) {
        lang = 'ru';
    }

    setLocale(lang);
    useWebAppViewport().disableVerticalSwipes();
    useWebAppViewport().expand();
    useWebAppBackButton().hideBackButton();

    if (initDataUnsafe.start_param) hideAll.value = true;

    startapp.value = initDataUnsafe.start_param;

    if (startapp.value) {
        await navigateTo(`/forms/user/${startapp.value}`);
        initDataUnsafe.start_param = '';
        return;
    }

    hideAll.value = false;

    const forms_res = await formStore.fetchForms(
        initDataUnsafe?.user?.id ?? 303
    );
    if (!forms_res) {
        return;
    }
    await sleep(500);
    isLoading.value = false;
});

async function handleOpenForm(formId: string) {
    await navigateTo(`/forms/user/${formId}/update`);
}
</script>

<template>
    <div v-if="!hideAll" class="w-full">
        <h6 class="text-sm font-medium ms-2 mb-2 tg-hint uppercase">
            {{ $t('my_forms') }}
        </h6>

        <button
            @click.prevent="openPopup"
            class="relative inline-flex w-full items-center justify-center tg-button p-1 mb-3 overflow-hidden text-lg font-medium rounded-xl group"
            :disabled="isLoading"
        >
            <div
                class="relative w-full px-5 py-2 group-hover:bg-opacity-0 rounded-lg size-12 flex items-center justify-center"
            >
                <div v-if="!isLoading" class="flex flex-row items-center gap-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        class="bi bi-plus"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                        />
                    </svg>
                    <span>{{ $t('create') }}</span>
                </div>

                <div v-else class="w-full items-center flex shimmer">
                    <div class="h-4 w-full grow-1"></div>
                </div>
            </div>
        </button>

        <div v-if="showPopup" class="popup-backdrop" @click.self="closePopup">
            <div class="popup-container">
                <div
                    class="popup-content relative flex flex-col gap-6 mb-16 p-3 pt-6 m-2"
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
                    <h3 class="text-lg font-bold tj">
                        {{ $t('choose') }}
                    </h3>
                    <div class="flex flex-col gap-2">
                        <button
                            @click="createSurveyForm"
                            class="inline-flex tt flex-row gap-3 items-center shadow-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0m7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
                                />
                            </svg>
                            <div class="flex flex-col gap-0.5 grow">
                                <h3>{{ t('survey') }}</h3>
                                <div class="font-normal text-base">
                                    {{ t('survey_desc') }}
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
                        <!-- <button
                            @click="createQuizForm"
                            class="inline-flex flex-row gap-3 items-center shadow-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0M4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"
                                />
                            </svg>
                            <div class="flex flex-col gap-0.5 grow">
                                <h3>Викторина</h3>
                                <div class="font-normal text-base">
                                    Проверяйте знания
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
                        </button> -->
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!isLoading">
            <button
                v-for="form in formStore.forms"
                :key="form._id"
                class="w-full text-left font-medium p-2 mb-2 rounded-xl flex flex-row tg-section flex items-center"
                @click.prevent="handleOpenForm(form._id)"
            >
                <div
                    class="grow-0 text-white mr-2 flex items-center justify-center rounded-lg shrink-0 size-12"
                    data-icon="FileText"
                    data-size="24px"
                    data-weight="regular"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                    >
                        <path
                            d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"
                        ></path>
                    </svg>
                </div>
                <div class="grow-1">{{ form.title }}</div>
            </button>
        </div>
        <Alerter ref="alerter" @answer="handleAlert" />
    </div>
</template>

<style scoped>
.popup-backdrop {
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

.close {
    color: var(--tg-theme-section-very-dark-bg-color);
}

.popup-content .tj {
    color: var(--tg-theme-text-color);
}

.popup-content button:active {
    transform: scale(0.975);
}
</style>
