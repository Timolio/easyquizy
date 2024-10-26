import { answersCollection, formsCollection } from '~/server/plugins/database';

export default defineEventHandler(async event => {
    const formId = event.context.params?.id as string;
    const ownerId = Number(getHeader(event, 'x-user-id') as string);

    const form = await formsCollection.findOne({
        _id: formId as unknown as { _id: string },
    });

    if (!form) {
        throw createError({
            statusCode: 404,
            message: 'Form not found',
        });
    }

    if (ownerId && form.owner_id !== ownerId) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden',
        });
    }

    const responses = await answersCollection
        .find({ form_id: formId })
        .toArray();

    const stats = {
        total: 0, // Общий счётчик всех ответов
    };

    responses.forEach(response => {
        // Увеличиваем общий счётчик ответов
        stats.total++;

        Object.entries(response.answers).forEach(([key, value]) => {
            // Инициализируем объект для каждого ключа, если его ещё нет
            if (!stats[key]) {
                stats[key] = {
                    answers: {}, // Для хранения подсчёта ответов
                    total: 0, // Для хранения общего числа респондентов для этого ключа
                };
            }

            if (Array.isArray(value)) {
                // Проверяем, начинается ли ключ с 'rml'
                if (key.startsWith('rml')) {
                    // Увеличиваем счётчик респондентов только если массив не пустой
                    if (value.length > 0) {
                        stats[key].total++;

                        // Для rml-сущностей считаем позиции
                        value.forEach((item, index) => {
                            if (!stats[key].answers[item]) {
                                stats[key].answers[item] = 0;
                            }
                            stats[key].answers[item] += index + 1; // Добавляем номер позиции + 1
                        });
                    }
                } else {
                    // Обычный подсчёт для всех остальных, если массив не пустой
                    if (value.length > 0) {
                        value.forEach(item => {
                            if (!stats[key].answers[item]) {
                                stats[key].answers[item] = 0;
                            }
                            stats[key].answers[item]++;
                        });
                        // Увеличиваем счётчик респондентов для других массивов
                        stats[key].total++;
                    }
                }
            } else {
                // Подсчёт для одиночных значений
                if (value !== undefined && value !== null) {
                    if (!stats[key].answers[value]) {
                        stats[key].answers[value] = 0;
                    }
                    stats[key].answers[value]++;

                    // Увеличиваем счётчик респондентов для одиночных значений
                    stats[key].total++;
                }
            }
        });
    });

    return stats;
});
