import { MongoClient } from 'mongodb';

const client = new MongoClient(useRuntimeConfig().MONGO_URI);
const db = client.db('teleforms');

export const formsCollection = db.collection('forms');
export const usersCollection = db.collection('users');
export const answersCollection = db.collection('answers');

export default defineNitroPlugin(async () => {
    await client.connect();
    console.log('Connected to MongoDB');
});
