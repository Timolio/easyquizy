import { WithId } from 'mongodb';
import { formsCollection } from '~/server/plugins/database';

export default defineEventHandler(
    async (event): Promise<WithId<Document>[]> => {
        const ownerId = Number(getHeader(event, 'x-user-id') as string);
        const forms = await formsCollection
            .find({ owner_id: ownerId })
            .toArray();
        return forms;
    }
);
