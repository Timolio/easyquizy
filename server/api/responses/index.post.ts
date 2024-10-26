import { answersCollection } from '~/server/plugins/database';
import { FormResponse } from '~/types/form';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(
    async (event): Promise<{ success: boolean }> => {
        const body = await readBody<FormResponse>(event);

        body.created_at = new Date().getTime();
        body._id = uuidv4();

        await answersCollection.insertOne(body);
        return { success: true };
    }
);
