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
        total: 0,
    };

    responses.forEach(response => {
        stats.total++;

        Object.entries(response.answers).forEach(([key, value]) => {
            if (!stats[key]) {
                stats[key] = {
                    answers: {},
                    total: 0,
                };
            }

            if (Array.isArray(value)) {
                if (key.startsWith('rml')) {
                    if (value.length > 0) {
                        stats[key].total++;

                        value.forEach((item, index) => {
                            if (!stats[key].answers[item]) {
                                stats[key].answers[item] = 0;
                            }
                            stats[key].answers[item] += index + 1;
                        });
                    }
                } else {
                    if (value.length > 0) {
                        value.forEach(item => {
                            if (!stats[key].answers[item]) {
                                stats[key].answers[item] = 0;
                            }
                            stats[key].answers[item]++;
                        });
                        stats[key].total++;
                    }
                }
            } else {
                if (value !== undefined && value !== null) {
                    if (!stats[key].answers[value]) {
                        stats[key].answers[value] = 0;
                    }
                    stats[key].answers[value]++;

                    stats[key].total++;
                }
            }
        });
    });

    return stats;
});
