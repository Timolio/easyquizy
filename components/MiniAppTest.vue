<script setup lang="ts">
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

onMounted(() => {
    const root = document.documentElement;
    const style = window.getComputedStyle(root);

    root.style.setProperty(
        '--tg-theme-button-light-color',
        adjust(style.getPropertyValue('--tg-theme-button-color') || '', 70)
    );
    root.style.setProperty(
        '--tg-theme-button-light-color2',
        adjust(style.getPropertyValue('--tg-theme-button-color') || '', 10)
    );
    root.style.setProperty(
        '--tg-theme-light-destructive-text-color',
        adjust(
            style.getPropertyValue('--tg-theme-destructive-text-color') || '',
            70
        )
    );
    root.style.setProperty(
        '--tg-theme-dark-destructive-text-color',
        adjust(
            style.getPropertyValue('--tg-theme-destructive-text-color') || '',
            -20
        )
    );
    root.style.setProperty(
        '--tg-theme-button-very-light-color',
        adjust(style.getPropertyValue('--tg-theme-button-color') || '', 160)
    );
    root.style.setProperty(
        '--tg-theme-section-dark-bg-color',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', -5)
    );
    root.style.setProperty(
        '--tg-theme-section-light-bg-color',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', 5)
    );
    root.style.setProperty(
        '--tg-theme-section-light-bg-color2',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', 32)
    );
    root.style.setProperty(
        '--tg-theme-section-light-bg-color3',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', 90)
    );
    root.style.setProperty(
        '--tg-theme-section-very-light-bg-color',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', 10)
    );
    root.style.setProperty(
        '--tg-theme-section-dark-bg-color2',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', -5)
    );
    root.style.setProperty(
        '--tg-theme-section-very-dark-bg-color',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', -10)
    );
    root.style.setProperty(
        '--tg-theme-section-very-dark-bg-color2',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', -20)
    );
    root.style.setProperty(
        '--tg-theme-button-shadow-color',
        addAlpha(style.getPropertyValue('--tg-theme-button-color') || '', 0.3)
    );
    root.style.setProperty(
        '--tg-theme-button-shadow-color2',
        addAlpha(style.getPropertyValue('--tg-theme-button-color') || '', 0.2)
    );
    root.style.setProperty(
        '--tg-theme-text-shadow-color',
        addAlpha(style.getPropertyValue('--tg-theme-text-color') || '', 0.3)
    );
    root.style.setProperty(
        '--tg-theme-text-shadow-color2',
        addAlpha(style.getPropertyValue('--tg-theme-text-color') || '', 0.5)
    );
    root.style.setProperty(
        '--tg-theme-shadow-destructive-text-color',
        addAlpha(
            style.getPropertyValue('--tg-theme-destructive-text-color') || '',
            0.3
        )
    );
    root.style.setProperty(
        '--tg-theme-shadow-destructive-text-color2',
        addAlpha(
            style.getPropertyValue('--tg-theme-destructive-text-color') || '',
            0.6
        )
    );
    root.style.setProperty(
        '--tg-theme-shadow-destructive-text-color3',
        addAlpha(
            style.getPropertyValue('--tg-theme-destructive-text-color') || '',
            0.2
        )
    );
    root.style.setProperty(
        '--tg-theme-destructive-text-light-color',
        adjust(
            style.getPropertyValue('--tg-theme-destructive-text-color') || '',
            10
        )
    );

    document.body.style.backgroundColor = style.getPropertyValue(
        '--tg-theme-secondary-bg-color'
    );
});
</script>
