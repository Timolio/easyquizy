import { Form } from '~/types/form';
import { answersCollection, formsCollection } from '~/server/plugins/database';

export default defineEventHandler(async (event): Promise<Form | null> => {
    const formId = event.context.params?.id as string | undefined;
    const userId = Number(getHeader(event, 'x-user-id') as string);
    const owner = getHeader(event, 'x-owner') === 'true';

    const form = (await formsCollection.findOne({
        _id: formId as unknown as { _id: string },
    })) as Form | null;

    if (!form) {
        throw createError({
            statusCode: 404,
            message: 'Form not found',
        });
    }

    if (owner) {
        if (form.owner_id === userId) {
            return form;
        } else {
            throw createError({
                statusCode: 403,
                message: 'Forbidden',
            });
        }
    } else {
        if (form.owner_id === userId) {
            return form;
        }

        const { owner_id, ...rest } = form;

        if (!form.open) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Forbidden',
            });
        }

        if (form.onetime) {
            const userResponse = await answersCollection.findOne({
                form_id: formId,
                owner_id: userId,
            });

            if (userResponse) {
                throw createError({
                    statusCode: 405,
                    message: 'Forbidden',
                });
            }
        }

        return rest;
    }
});
