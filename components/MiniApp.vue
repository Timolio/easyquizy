<script setup lang="ts">
const {
    useWebAppTheme,
    ExpandedViewport,
    useWebAppBackButton,
    useWebAppViewport,
} = await import('vue-tg');

function adjust(color: string, amount: number) {
    return (
        '#' +
        color
            .replace(/^#/, '')
            .replace(/../g, color =>
                (
                    '0' +
                    Math.min(
                        255,
                        Math.max(0, parseInt(color, 16) + amount)
                    ).toString(16)
                ).slice(-2)
            )
    );
}

function addAlpha(color: string, opacity: number) {
    var _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

const theme = useWebAppTheme();
const root = document.documentElement;

root.style.setProperty(
    '--tg-theme-button-light-color',
    adjust(theme.themeParams.value.button_color || '', 70)
);
root.style.setProperty(
    '--tg-theme-button-light-color2',
    adjust(theme.themeParams.value.button_color || '', 10)
);
root.style.setProperty(
    '--tg-theme-button-dark-color',
    adjust(theme.themeParams.value.button_color || '', -70)
);
root.style.setProperty(
    '--tg-theme-light-destructive-text-color',
    adjust(theme.themeParams.value.destructive_text_color || '', 70)
);
root.style.setProperty(
    '--tg-theme-dark-destructive-text-color',
    adjust(theme.themeParams.value.destructive_text_color || '', -20)
);
root.style.setProperty(
    '--tg-theme-button-very-light-color',
    adjust(theme.themeParams.value.button_color || '', 160)
);
root.style.setProperty(
    '--tg-theme-section-dark-bg-color',
    adjust(theme.themeParams.value.section_bg_color || '', -6)
);
root.style.setProperty(
    '--tg-theme-section-light-bg-color',
    adjust(theme.themeParams.value.section_bg_color || '', 6)
);
root.style.setProperty(
    '--tg-theme-section-light-bg-color2',
    adjust(theme.themeParams.value.section_bg_color || '', 32)
);
root.style.setProperty(
    '--tg-theme-section-light-bg-color3',
    adjust(theme.themeParams.value.section_bg_color || '', 90)
);
root.style.setProperty(
    '--tg-theme-button-shadow-color',
    addAlpha(theme.themeParams.value.button_color || '', 0.3)
);
root.style.setProperty(
    '--tg-theme-button-shadow-color2',
    addAlpha(theme.themeParams.value.button_color || '', 0.2)
);
root.style.setProperty(
    '--tg-theme-text-shadow-color',
    addAlpha(theme.themeParams.value.text_color || '', 0.3)
);
root.style.setProperty(
    '--tg-theme-text-shadow-color2',
    addAlpha(theme.themeParams.value.text_color || '', 0.5)
);
root.style.setProperty(
    '--tg-theme-section-very-dark-bg-color',
    adjust(theme.themeParams.value.section_bg_color || '', -15)
);
root.style.setProperty(
    '--tg-theme-shadow-destructive-text-color',
    addAlpha(theme.themeParams.value.destructive_text_color || '', 0.3)
);
root.style.setProperty(
    '--tg-theme-shadow-destructive-text-color2',
    addAlpha(theme.themeParams.value.destructive_text_color || '', 0.6)
);
root.style.setProperty(
    '--tg-theme-shadow-destructive-text-color3',
    addAlpha(theme.themeParams.value.destructive_text_color || '', 0.2)
);
root.style.setProperty(
    '--tg-theme-destructive-text-light-color',
    adjust(theme.themeParams.value.destructive_text_color || '', 10)
);

theme.setBackgroundColor('secondary_bg_color');
theme.setHeaderColor('secondary_bg_color');
if (theme.themeParams.value.secondary_bg_color !== undefined) {
    document.body.style.backgroundColor =
        theme.themeParams.value.secondary_bg_color;
}

useWebAppViewport().expand();

useWebAppBackButton().hideBackButton();
</script>

<template>
    <ExpandedViewport />
</template>
