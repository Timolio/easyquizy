<script setup lang="ts">
import { useRouter } from 'vue-router';
import { VueDraggableNext } from 'vue-draggable-next';
import { useFormStore } from '~/stores/form';
import _ from 'lodash';
import { type VNodeRef } from 'vue';
const { useWebApp, useWebAppBackButton, useWebAppViewport } = await import(
    'vue-tg'
);
const { initDataUnsafe } = useWebApp();
const formStore = useFormStore();
const route = useRoute();
const router = useRouter();

const goHome = async () => {
    await navigateTo('/');
};

let element = {
    title: '',
    description: '',
    type: 'one',
    required: false,
    options: [''],
};
let elementBefore = ref(_.cloneDeep(element));
const hotbarRef = ref(null);
const isEditingModalVisible = ref(false);
const isShowingResponses = ref(false);
const isLoading = ref(true);
const editingHeading = ref(false);
const scrollingCache = ref(0);
const activeElementId = ref('heading');
const responsesLoading = ref(false);
const alerter = ref();

const updateSectionBasedOnHash = () => {
    isShowingResponses.value = route.hash === '#responses';
    window.scrollTo(0, 0);
};

const isPieChart = (type: string) => ['multiple', 'one'].includes(type);

watch(
    () => route.hash,
    () => {
        updateSectionBasedOnHash();
    }
);

const setActiveElement = (elementId: string) => {
    activeElementId.value = elementId;
};

const handleClick = async () => {
    responsesLoading.value = true;
    await refreshAnswers();
};

const handleAccept = async () => {
    formStore.currentForm.open = !formStore.currentForm.open;
    await saveForm();
};

const handleAlert = async (bId: string) => {
    if (bId === 'delete') {
        await formStore.deleteForm(
            route.params.id as string,
            initDataUnsafe?.user?.id ?? 303
        );
        await goHome();
        alerter.value.close();
    } else if (bId === 'cancel') {
        alerter.value.close();
    }
};

const deleteForm = () => {
    alerter.value.alert('Ты точно хочешь удалить эту форму?', [
        {
            id: 'delete',
            title: 'Да',
            decoration: 'centered',
        },
        {
            id: 'cancel',
            title: 'Отмена',
            style: 'cancel',
            decoration: 'centered',
        },
    ]);
};

const refreshAnswers = _.debounce(async () => {
    await formStore.fetchResponses(
        route.params.id as string,
        initDataUnsafe?.user?.id ?? 303
    );
    responsesLoading.value = false;

    console.log(formStore.responses);
}, 2000);

const editHeading = async () => {
    scrollingCache.value = window.scrollY;
    window.scrollTo(0, 0);
    editingHeading.value = true;
    elementBefore.value = {
        title: formStore.currentForm?.title ?? '',
        description: formStore.currentForm?.description ?? '',
        onetime: formStore.currentForm?.onetime,
    };
    isEditingModalVisible.value = true;
    element = formStore.currentForm;

    await nextTick(() => {
        document.querySelectorAll('textarea.mei').forEach(el => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    });
};

const linkCopied = () => {
    alerter.value.alert(
        '<strong>Ссылка на вашу форму <em>скопирована</em>!</strong>',
        [{ id: 'cancel', title: 'ОК', decoration: 'centered' }]
    );
};

const saveForm = _.debounce(async () => {
    if (formStore.currentForm) {
        await formStore.updateForm(
            formStore.currentForm,
            initDataUnsafe?.user?.id ?? 303
        );
    }
}, 500);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    isLoading.value = true;

    const res = await formStore.fetchFormById(
        route.params.id as string,
        initDataUnsafe?.user?.id ?? 303,
        true
    );

    await formStore.fetchResponses(
        route.params.id as string,
        initDataUnsafe?.user?.id ?? 303
    );

    if (!res) {
        await navigateTo(`/forms/user/${route.params.id}`);
    }

    let timeout: NodeJS.Timeout | null = null;

    updateSectionBasedOnHash();
    await sleep(500);
    isLoading.value = false;
    nextTick(() => {
        document.querySelectorAll('.fh').forEach(el => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    });
});

const closeEditingModal = async () => {
    if (element?.options?.length && element?.options?.length !== 0) {
        element.options = element.options.filter(option => option !== '');
    }
    if (element?.type === 'text-short' || element?.type === 'text-long') {
        element.options = [];
    }
    if (
        (element?.type === 'one' || element?.type === 'multiple') &&
        element?.options?.length === 0
    ) {
        element.options = ['Вариант 1'];
    }
    if (element?.title === '') {
        element.title = 'Новый элемент';
    }
    if (element?.options instanceof Array && element?.options) {
        element.options = [...new Set(element.options)];
    }

    if (editingHeading.value) {
        if (
            element.title !== elementBefore.value.title ||
            element.description !== elementBefore.value.description ||
            element.onetime !== elementBefore.value.onetime
        ) {
            saveForm();
        }
        editingHeading.value = false;
    } else if (!_.isEqual(elementBefore.value, element)) {
        saveForm();
    }

    elementBefore.value = {};

    isEditingModalVisible.value = false;
    await nextTick(() => {
        window.scrollTo(0, scrollingCache.value);
    });
};

useWebAppBackButton().showBackButton();

useWebAppBackButton().onBackButtonClicked(async () => {
    if (isEditingModalVisible.value) {
        closeEditingModal();
    } else if (isShowingResponses.value) {
        await router.push({
            hash: '',
        });
        isShowingResponses.value = false;
    } else if (hotbarRef.value.isModalVisible) {
        hotbarRef.value.closeModal();
    } else {
        await goHome();
    }
});

const openEditingModal = async (elementId: number, newEl: boolean = false) => {
    scrollingCache.value = window.scrollY;
    window.scrollTo(0, 0);
    element = formStore.currentForm?.elements[elementId] ?? element;
    if (newEl) {
        elementBefore.value = {};
    } else {
        elementBefore.value = _.cloneDeep(element);
    }
    isEditingModalVisible.value = true;
    await nextTick(() => {
        document.querySelectorAll('textarea.mei').forEach(el => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        });
    });
};

const removeElement = (elementId: number) => {
    formStore.deleteElement(elementId);
    saveForm();
};

const $route = useRouter().currentRoute;
useWebAppViewport().disableVerticalSwipes();
useWebAppViewport().expand();
</script>

<template>
    <div v-if="isLoading" class="flex flex-col gap-4 w-full">
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
    <div v-else-if="formStore.currentForm" class="w-full">
        <div v-if="isEditingModalVisible" class="flex flex-col gap-3">
            <!-- <button @click="closeEditingModal">Close</button> -->
            <div class="tg-element me rounded-xl">
                <div class="he rounded-b-xl p-4 flex flex-col gap-3">
                    <div v-if="element?.type">
                        <h6 class="text-sm font-medium ms-2 mb-1 tg-hint">
                            ТИП
                        </h6>
                        <select
                            id="type"
                            v-model="element.type"
                            class="p-2 mei text-xl w-full"
                        >
                            <option value="one">Один из списка</option>
                            <option value="multiple">
                                Несколько из списка
                            </option>
                            <option value="text-short">Текст (строка)</option>
                            <option value="text-long">Текст (абзац)</option>
                        </select>
                    </div>
                    <div>
                        <h6 class="text-sm font-medium ms-2 mb-1 tg-hint">
                            ЗАГОЛОВОК
                        </h6>
                        <textarea
                            rows="1"
                            @keydown.enter.prevent
                            oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                            v-model="element.title"
                            class="border mei text-xl px-3 py-2 w-full"
                        ></textarea>
                    </div>
                    <div>
                        <h6 class="text-sm font-medium ms-2 mb-1 tg-hint">
                            ОПИСАНИЕ
                        </h6>
                        <textarea
                            oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
                            v-model="element.description"
                            class="border mei text-xl px-3 py-2 w-full"
                            rows="4"
                        ></textarea>
                    </div>
                    <div
                        v-if="
                            element?.required === true ||
                            element?.required === false
                        "
                        class="flex flex-row items-center justify-between text-lg mx-2"
                    >
                        Обязательное поле
                        <label class="switch ml-2">
                            <input
                                @click="element.required = !element.required"
                                type="checkbox"
                                :checked="element.required"
                            />
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div
                        v-if="
                            element?.onetime === true ||
                            element?.onetime === false
                        "
                        class="flex flex-row items-center justify-between text-lg mx-2"
                    >
                        Одноразовая форма
                        <label class="switch ml-2">
                            <input
                                @click="element.onetime = !element.onetime"
                                type="checkbox"
                                :checked="element.onetime"
                            />
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <div
                    v-if="element.type === 'one' || element.type === 'multiple'"
                    class="ce flex flex-col gap-2 p-4"
                >
                    <VueDraggableNext
                        v-if="element.options.length > 0"
                        handle=".drag-handle"
                        :list="element.options"
                        ghost-class="ghost"
                        chosen-class="chosen"
                        drag-class="drag"
                        class="flex flex-col gap-2"
                    >
                        <div
                            v-for="(option, index) in element.options"
                            class="e flex flex-row items-center p-1 rounded-xl"
                        >
                            <div
                                class="ebm drag-handle flex items-center justify-center rounded-lg shrink-0 size-10 grow-0"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                v-model="element.options[index]"
                                class="ie grow py-1 text-lg"
                            />
                            <button
                                class="ebd flex items-center justify-center rounded-lg shrink-0 size-10 grow-0"
                                @click="element.options.splice(index, 1)"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"
                                    />
                                </svg>
                            </button>
                        </div>
                    </VueDraggableNext>
                    <button
                        class="w-full neb flex flex-row items-center p-1 rounded-xl"
                        @click="element.options.push('')"
                    >
                        <div
                            class="ebm drag-handle flex items-center justify-center rounded-lg shrink-0 size-10 grow-0"
                        ></div>
                        Добавить вариант
                    </button>
                </div>
            </div>
        </div>
        <div v-else-if="isShowingResponses">
            <div class="grid grid-cols-1 gap-4 mb-8">
                <div class="tg-element main reda rounded-xl">
                    <div class="px-6 py-5 header">
                        <div
                            v-if="!responsesLoading"
                            class="flex flex-row justify-between"
                        >
                            <div>
                                <h1 class="text-base">Всего ответов</h1>
                                <p class="text-2xl font-bold">
                                    {{ formStore.responses.total }}
                                </p>
                            </div>
                            <div class="flex items-center">
                                <button
                                    class="rl rounded-full p-2 absolute -right-2 -top-2"
                                    @click="handleClick"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="32"
                                        height="32"
                                        fill="currentColor"
                                        viewBox="0 0 30 30"
                                    >
                                        <path
                                            d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <div class="h-4 w-full shimmer"></div>
                        </div>
                    </div>
                    <div class="footer p-2">
                        <div
                            class="flex flex-row items-center mx-2 justify-between font-bold text-lg ml-2"
                        >
                            <div v-if="formStore.currentForm.open">
                                Ответы принимаются
                            </div>
                            <div v-else class="destructive">
                                Ответы не принимаются
                            </div>

                            <label class="switch ml-2">
                                <input
                                    @click="handleAccept"
                                    type="checkbox"
                                    :checked="formStore.currentForm.open"
                                />
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="formStore.responses.total" class="flex flex-col gap-4">
                <div
                    v-for="(element, index) in formStore.currentForm.elements"
                    :key="index"
                    class="tg-element rounded-xl"
                >
                    <div class="main">
                        <div
                            class="header px-6 py-5 text-xl rounded-b-xl flex flex-col"
                        >
                            <h3>{{ element.title }}</h3>
                            <em class="text-base tg-hint cursive">
                                {{
                                    formStore.responses[element.id]?.total ?? 0
                                }}
                                ответов
                            </em>
                        </div>
                        <div class="text-lg">
                            <div v-if="formStore.responses[element.id]">
                                <PieChart
                                    v-if="isPieChart(element.type)"
                                    :data="formStore.responses[element.id]"
                                    class="px-6 py-5"
                                />
                                <!-- <TopChart
                                    v-else-if="element.type === 'rank-multiple'"
                                    :data="formStore.responses[element.id]"
                                    class="px-6 py-5"
                                /> -->
                                <div v-else-if="element.type === 'text-short'">
                                    <PaginatedList
                                        :responses="
                                            formStore.responses[element.id]
                                        "
                                        :items-per-page="5"
                                    />
                                </div>
                                <div v-else-if="element.type === 'text-long'">
                                    <PaginatedList
                                        :responses="
                                            formStore.responses[element.id]
                                        "
                                        :items-per-page="2"
                                    />
                                </div>
                            </div>
                            <div v-else></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div
                class="tg-element main rounded-xl mb-4"
                @touchstart="activeElementId = 'heading'"
                @mousedown="activeElementId = 'heading'"
            >
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
                <div
                    class="flex flex-row-reverse p-2"
                    v-if="activeElementId === 'heading'"
                >
                    <button
                        class="tg-destructive-button mr-2 flex items-center justify-center rounded-lg shrink-0 size-10"
                        @click="deleteForm"
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
                        @click="editHeading"
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
            <VueDraggableNext
                :list="formStore.currentForm.elements"
                handle=".drag-handle"
                ghost-class="ghost"
                chosen-class="chosen"
                drag-class="drag"
                class="flex flex-col gap-4"
                @end="saveForm"
            >
                <FormElement
                    v-for="(element, index) in formStore.currentForm?.elements"
                    @edit="openEditingModal"
                    :key="index"
                    :element="element"
                    :elementId="index"
                    @delete="removeElement"
                    :show-controls="activeElementId === element.id"
                    @activated="setActiveElement"
                />
            </VueDraggableNext>
            <div class="h-32"></div>
        </div>
        <HotBar
            v-if="!isLoading && !isEditingModalVisible && !isShowingResponses"
            ref="hotbarRef"
            @newEl="openEditingModal"
            @linkCopied="linkCopied"
        />
        <Alerter ref="alerter" @answer="handleAlert" />
    </div>
</template>

<style scoped>
.he {
    background-color: var(--tg-theme-section-dark-bg-color);
}

.ie {
    background: none;
}

.ebd {
    color: var(--tg-theme-destructive-text-color);
}

.ebm {
    color: var(--tg-theme-hint-color);
}

.neb {
    background-color: var(--tg-theme-secondary-bg-color);
    color: var(--tg-theme-hint-color);
}

.e {
    /* border: 1px solid var(--tg-theme-hint-color); */
    background-color: var(--tg-theme-secondary-bg-color);
}

.mei {
    background-color: var(--tg-theme-secondary-bg-color);
    border: none;
    border-radius: 0.75rem;
}

.rl {
    background-color: var(--tg-theme-section-dark-bg-color);
    color: var(--tg-theme-text-color);
}

.rl:active {
    transform: scale(0.975);
}

.reda {
    overflow: visible !important;
}

.animate-spin2 {
    animation: spin 1s linear infinite;

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
}

.delete-button {
    /* background-color: var(--tg-theme-section-dark-bg-color); */
    border: 3px dashed var(--tg-theme-destructive-text-color);
    color: var(--tg-theme-destructive-text-color);
}
</style>
