import { formsCollection } from '~/server/plugins/database';
import { v4 as uuidv4 } from 'uuid';
import { Form } from '~/types/form';

export default defineEventHandler(async event => {
    const form = (await readBody(event)) as Omit<
        Form,
        '_id' | 'created_at' | 'owner_id'
    >;
    const ownnerId = Number(getHeader(event, 'x-user-id') as string);
    const formId = uuidv4() as string;

    const newForm = {
        ...form,
        _id: formId,
        created_at: new Date().getTime(),
        owner_id: ownnerId,
    };

    const result = await formsCollection.insertOne(newForm);
    return formId;
});
