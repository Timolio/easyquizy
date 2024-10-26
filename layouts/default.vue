<script setup lang="ts">
useHead({
    script: [
        {
            src: 'https://telegram.org/js/telegram-web-app.js',
            defer: true,
        },
    ],
});
</script>

<template>
    <main>
        <ClientOnly>
            <slot />
            <MiniApp />
        </ClientOnly>
        <!-- <MiniAppTest /> -->
    </main>
</template>

<style>
main {
    /* overflow-y: auto; */
    min-height: 100vh;
    display: flex;
    padding: 1rem 1.2rem;
}

html::-webkit-scrollbar {
    display: none;
}

html {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
