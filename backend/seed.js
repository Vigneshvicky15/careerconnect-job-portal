import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4
    });
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing jobs
    await Job.deleteMany({});
    
    // Create a recruiter user to own the jobs
    let recruiter = await User.findOne({ email: 'recruiter@techcorp.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Jane Doe',
        email: 'recruiter@techcorp.com',
        password: 'password123',
        role: 'recruiter',
        title: 'Senior Talent Acquisition',
      });
    }

    const sampleJobs = [
      {
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to lead our frontend architecture and build highly scalable web applications. You will be responsible for creating robust components and mentoring junior engineers.',
        requirements: ['5+ years React experience', 'Advanced State Management (Redux/Zustand)', 'Strong TypeScript skills', 'Experience with performance optimization'],
        salary: '$120,000 - $150,000',
        location: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        companyName: 'TechFlow Solutions',
        recruiter: recruiter._id
      },
      {
        title: 'Full Stack MERN Engineer',
        description: 'Join our fast-paced startup to build innovative products from the ground up. You will work on both the Node.js backend and React frontend, designing schemas and building APIs.',
        requirements: ['3+ years in Node.js and Express', 'Strong MongoDB aggregation skills', 'React and Vite experience', 'Understanding of RESTful APIs'],
        salary: '$90,000 - $120,000',
        location: 'New York, NY',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        companyName: 'Innovate Labs',
        recruiter: recruiter._id
      },
      {
        title: 'UI/UX Designer',
        description: 'We need a creative UI/UX designer to craft beautiful, intuitive, and user-centric interfaces. You will work closely with product managers and engineers to deliver top-notch experiences.',
        requirements: ['Portfolio demonstrating web & mobile design', 'Figma mastery', 'Experience with design systems', 'Prototyping skills'],
        salary: '$80,000 - $110,000',
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        experienceLevel: 'Mid',
        companyName: 'Creative Minds',
        recruiter: recruiter._id
      },
      {
        title: 'Backend Developer (Node.js)',
        description: 'Looking for a backend specialist to handle high-traffic systems. Your primary focus will be the development of all server-side logic, definition and maintenance of the central database.',
        requirements: ['Strong understanding of Node.js', 'Experience with microservices', 'PostgreSQL and MongoDB', 'Docker and CI/CD pipelines'],
        salary: '$130,000 - $160,000',
        location: 'Austin, TX',
        jobType: 'Contract',
        experienceLevel: 'Lead',
        companyName: 'CloudScale Inc',
        recruiter: recruiter._id
      },
      {
        title: 'Frontend Developer Intern',
        description: 'Great opportunity for a recent graduate to gain real-world experience building modern web applications. You will work alongside senior developers and learn enterprise-level practices.',
        requirements: ['Solid understanding of HTML, CSS, JS', 'Familiarity with React', 'Eager to learn', 'Good communication skills'],
        salary: '$30/hr',
        location: 'Remote',
        jobType: 'Internship',
        experienceLevel: 'Entry',
        companyName: 'StartupX',
        recruiter: recruiter._id
      },
      {
        title: 'Part-time QA Engineer',
        description: 'We are seeking a QA engineer to help us maintain a bug-free application. You will write automated tests and perform manual testing on new features.',
        requirements: ['Experience with Cypress or Playwright', 'Understanding of manual testing methodologies', 'Detail-oriented', 'Availability for 20 hours/week'],
        salary: '$40,000 - $60,000',
        location: 'Remote',
        jobType: 'Part-time',
        experienceLevel: 'Entry',
        companyName: 'QualityFirst',
        recruiter: recruiter._id
      }
    ];

    await Job.insertMany(sampleJobs);
    console.log('Successfully seeded database with realistic jobs!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
