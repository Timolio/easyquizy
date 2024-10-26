import { formsCollection } from '~/server/plugins/database';
import { Form } from '~/types/form';

export default defineEventHandler(async (event): Promise<Form> => {
    const formId = event.context.params?.id as string;
    const updatedForm = (await readBody(event)) as Form;
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

    await formsCollection.updateOne({ _id: formId }, { $set: updatedForm });
    return updatedForm;
});
