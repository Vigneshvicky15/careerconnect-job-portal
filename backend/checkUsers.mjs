import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);
await mongoose.connect(process.env.MONGO_URI, { family: 4 });
const db = mongoose.connection.db;

// Show ALL users
const users = await db.collection('users').find({}).project({name:1, email:1, role:1, isVerified:1}).toArray();
console.log('ALL Users in DB:', users.length);
users.forEach(u => console.log(`  ${u.isVerified ? '✓' : '✗'} ${u.email} | ${u.role}`));

// Delete ALL users completely
const del = await db.collection('users').deleteMany({});
// Also clear jobs and applications to reset fully
const delJobs = await db.collection('jobs').deleteMany({});
const delApps = await db.collection('applications').deleteMany({});

console.log(`\nDeleted ${del.deletedCount} users, ${delJobs.deletedCount} jobs, ${delApps.deletedCount} applications`);
console.log('Database fully reset! Now register with any email fresh.');
process.exit(0);
