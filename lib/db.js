import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
let client, clientPromise;
if (!uri) clientPromise = null;
else { client = new MongoClient(uri); clientPromise = client.connect(); }
export async function db() { if (!clientPromise) throw new Error('MONGODB_URI is not configured'); return (await clientPromise).db(); }
