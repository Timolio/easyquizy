import { formsCollection } from '~/server/plugins/database';

export default defineEventHandler(
    async (event): Promise<{ success: boolean }> => {
        const formId = event.context.params?.id as string;
        const ownerId = Number(getHeader(event, 'x-user-id') as string);

        const form = await formsCollection.findOne({ _id: formId });

        if (!form) {
            throw createError({
                statusCode: 404,
                message: 'Form not found',
            });
        }

        if (form.owner_id !== ownerId) {
            throw createError({
                statusCode: 403,
                message: 'Forbidden',
            });
        }

        await formsCollection.deleteOne({ _id: formId });
        return { success: true };
    }
);
