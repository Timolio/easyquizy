import { usersCollection } from '../plugins/database';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const userId = Number(query.userId);

    if (!userId) {
        return { exists: false };
    }

    try {
        const user = await usersCollection.findOne({ _id: userId });
        return { exists: !!user };
    } catch (error) {
        console.error('Error');
        return { exists: false };
    }
});
