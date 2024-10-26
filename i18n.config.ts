export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            create: 'Create',
            my_forms: 'My surveys',
            survey: 'Survey',
            survey_desc: 'Collect data',
            launch_bot: 'Launch the bot before creating own surveys',
            choose: 'Choose what to create',
            one_title: 'Multiple choice',
            one_desc: 'Choose one option',
            mtl_title: 'Checkboxes',
            mtl_desc: 'Choose several options',
            txs_title: 'Short answer text',
            txs_desc: 'Write short answer',
            txl_title: 'Paragraph text',
            txl_desc: 'Write long anwer',
        },
        ru: {
            create: 'Создать',
            my_forms: 'Мои опросы',
            survey: 'Опрос',
            survey_desc: 'Собирайте данные',
            launch_bot: 'Запусти бота перед тем, как создавать свои опросы',
            choose: 'Выбери, что создать',
            one_title: 'Один из списка',
            one_desc: 'Выбрать один вариант',
            mtl_title: 'Несколько из списка',
            mtl_desc: 'Выбрать несколько вариантов',
            txs_title: 'Текст (строка)',
            txs_desc: 'Короткий текстовый ответ',
            txl_title: 'Текст (абзац)',
            txl_desc: 'Длинный текстовый ответ',
        },
        uk: {
            create: 'Створити',
            my_forms: 'Мої опитування',
            survey: 'Опитування',
            survey_desc: 'Збирайте дані',
            launch_bot: 'Запусти бота перед тим, як створювати свої опитування',
            choose: 'Вибери, що створити',
            one_title: 'Один з списку',
            one_desc: 'Вибрати один варіант',
            mtl_title: 'Кілька з списку',
            mtl_desc: 'Вибрати кілька варіантів',
            txs_title: 'Текст (строка)',
            txs_desc: 'Коротка текстова відповідь',
            txl_title: 'Текст (абзац)',
            txl_desc: 'Довга текстова відповідь',
        },
    },
}));
