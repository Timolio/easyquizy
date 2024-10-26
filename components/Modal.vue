<script setup lang="ts">
const emit = defineEmits(['close']);

function close() {
    emit('close');
}
</script>

<template>
    <div
        class="modal-backdrop flex flex-col overflow-y-scroll overflow-x-hidden fixed top-0 right-0 left-0 z-50 items-center w-full h-full max-h-[100vh]"
    >
        <div class="modal relative w-full max-w-full max-h-full">
            <section class="modal-body flex gap-3 flex-col">
                <slot name="body"> This is the default body! </slot>
            </section>

            <footer class="modal-footer">
                <slot name="footer">
                    <!-- <button type="button" class="btn-green" @click="close">
                        Close Modal
                    </button> -->
                </slot>
            </footer>
        </div>
    </div>
</template>

<style>
.modal-backdrop {
    background-color: var(--tg-theme-secondary-bg-color);
    padding: 1rem 1.2rem;
    z-index: 1000;
}

.modal-backdrop::-webkit-scrollbar {
    display: none;
}

.modal-backdrop {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.modal-footer {
    display: flex;
}

.modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4aae9b;
    justify-content: space-between;
}

.modal-footer {
    flex-direction: column;
    justify-content: flex-end;
}

/* .modal {
    height: 100%;
    width: 100%;
    background: var(--tg-theme-secondary-bg-color);
    overflow-x: auto;
    display: flex;
    flex-direction: column;
} */

.modal-body {
    position: relative;
}

.btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4aae9b;
    background: transparent;
}

.btn-green {
    color: white;
    background: #4aae9b;
    border: 1px solid #4aae9b;
    border-radius: 2px;
}
</style>
