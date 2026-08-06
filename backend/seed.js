import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';
import Application from './models/Application.js';

dotenv.config();

const recruitersData = [
  { name: 'TCS Recruitment', email: 'hiring@tcs.com', company: 'Tata Consultancy Services', logo: 'https://ui-avatars.com/api/?name=TCS&background=1E3A8A&color=fff' },
  { name: 'Amazon Careers', email: 'recruitment@amazon.in', company: 'Amazon', logo: 'https://ui-avatars.com/api/?name=Amazon&background=F59E0B&color=fff' },
  { name: 'TechFlow HR', email: 'hr.careers@techflow.io', company: 'TechFlow', logo: 'https://ui-avatars.com/api/?name=TechFlow&background=10B981&color=fff' }
];

const seekersData = [
  { name: 'Rahul Sharma', email: 'rahul.dev@gmail.com', skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'], title: 'Full Stack Developer', bio: 'Passionate developer with 3 years of experience building scalable web applications.' },
  { name: 'Priya Patel', email: 'priya.design@gmail.com', skills: ['Figma', 'UI/UX', 'Adobe XD', 'CSS'], title: 'UI/UX Designer', bio: 'Creative designer focused on crafting user-centric digital experiences.' },
  { name: 'Vignesh Kumar', email: 'vignesh.marketing@gmail.com', skills: ['SEO', 'Digital Marketing', 'Google Ads', 'Content Strategy'], title: 'Marketing Specialist', bio: 'Data-driven marketer helping brands grow their online presence.' }
];

const generateJobs = (recruiters) => {
  const jobTemplates = [
    { title: 'Frontend Developer (React)', jobType: 'Full-time', level: 'Mid', salary: '₹8,00,000 - ₹12,00,000', reqs: ['React', 'JavaScript', 'Tailwind', 'Redux'], desc: 'Build modern user interfaces with React and Tailwind.' },
    { title: 'Backend Software Engineer', jobType: 'Full-time', level: 'Senior', salary: '₹15,00,000 - ₹25,00,000', reqs: ['Node.js', 'Express', 'MongoDB', 'AWS'], desc: 'Design and optimize scalable backend microservices.' },
    { title: 'UI/UX Product Designer', jobType: 'Full-time', level: 'Mid', salary: '₹6,00,000 - ₹10,00,000', reqs: ['Figma', 'Prototyping', 'User Research'], desc: 'Create beautiful user flows and high-fidelity mockups.' },
    { title: 'Digital Marketing Lead', jobType: 'Full-time', level: 'Lead', salary: '₹12,00,000 - ₹18,00,000', reqs: ['SEO', 'SEM', 'Google Analytics'], desc: 'Lead our digital marketing campaigns and grow organic traffic.' },
    { title: 'Data Scientist', jobType: 'Full-time', level: 'Mid', salary: '₹10,00,000 - ₹16,00,000', reqs: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'], desc: 'Extract insights from massive datasets to drive business decisions.' },
    { title: 'DevOps Engineer', jobType: 'Contract', level: 'Senior', salary: '₹18,00,000 - ₹24,00,000', reqs: ['Kubernetes', 'Docker', 'CI/CD', 'Linux'], desc: 'Maintain our cloud infrastructure and automate deployment pipelines.' },
    { title: 'React Native Developer', jobType: 'Full-time', level: 'Mid', salary: '₹9,00,000 - ₹14,00,000', reqs: ['React Native', 'Mobile Dev', 'API Integration'], desc: 'Develop cross-platform mobile apps for iOS and Android.' },
    { title: 'Cybersecurity Analyst', jobType: 'Full-time', level: 'Entry', salary: '₹4,00,000 - ₹7,00,000', reqs: ['Network Security', 'Ethical Hacking', 'Linux'], desc: 'Monitor systems for security breaches and conduct vulnerability assessments.' },
    { title: 'Product Manager', jobType: 'Full-time', level: 'Senior', salary: '₹20,00,000 - ₹30,00,000', reqs: ['Agile', 'Product Strategy', 'Jira', 'Leadership'], desc: 'Lead product development from ideation to launch.' },
    { title: 'Content Writer', jobType: 'Part-time', level: 'Entry', salary: '₹2,00,000 - ₹4,00,000', reqs: ['Copywriting', 'SEO', 'Grammar'], desc: 'Write engaging blog posts, articles, and website copy.' }
  ];

  const locations = ['Chennai, TN', 'Bangalore, KA', 'Remote', 'Pune, MH', 'Hyderabad, TS'];
  const allJobs = [];

  // Generate 50 jobs (5 variations of the 10 templates)
  for (let i = 0; i < 5; i++) {
    for (let template of jobTemplates) {
      const recruiter = recruiters[Math.floor(Math.random() * recruiters.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      allJobs.push({
        title: template.title,
        description: template.desc + `\n\nJoin ${recruiter.name} and make an impact. We offer great benefits, flexible hours, and a vibrant work culture.`,
        requirements: template.reqs,
        salary: template.salary,
        location: location,
        jobType: template.jobType,
        experienceLevel: template.level,
        companyName: recruiter.company,
        companyLogoUrl: recruiter.logo,
        recruiter: recruiter._id,
      });
    }
  }
  return allJobs;
};

export const seedDB = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount >= 50) {
      console.log('Database already seeded with enough jobs. Skipping seed.');
      return;
    }

    console.log('Starting Massive DB Seeding...');

    // 1. Clear existing dummy data if any
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({ email: { $in: [...recruitersData.map(r => r.email), ...seekersData.map(s => s.email)] } });

    // 2. Create Recruiters
    const createdRecruiters = [];
    for (let rData of recruitersData) {
      let rec = await User.create({
        name: rData.name,
        email: rData.email,
        password: 'password123',
        role: 'recruiter',
        isVerified: true
      });
      // Attach company details temporarily for job generation
      rec.company = rData.company;
      rec.logo = rData.logo;
      createdRecruiters.push(rec);
    }
    console.log('Created 3 Authentic Recruiters.');

    // 3. Create Seekers
    const createdSeekers = [];
    for (let sData of seekersData) {
      const seeker = await User.create({
        name: sData.name,
        email: sData.email,
        password: 'password123',
        role: 'seeker',
        isVerified: true,
        skills: sData.skills,
        title: sData.title,
        bio: sData.bio,
        resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF
        resumeName: `${sData.name.replace(' ', '_')}_Resume.pdf`
      });
      createdSeekers.push(seeker);
    }
    console.log('Created 3 Authentic Candidates.');

    // 4. Create 50 Jobs
    const jobsToInsert = generateJobs(createdRecruiters);
    const insertedJobs = await Job.insertMany(jobsToInsert);
    console.log(`Created ${insertedJobs.length} Jobs across multiple locations and categories.`);

    // 5. Create Applications (Manage System Demonstration)
    console.log('Simulating incoming applications for Recruiters...');
    const applicationStatuses = ['Pending', 'Under Review', 'Shortlisted', 'Interviewing', 'Rejected'];
    
    // Have each seeker apply to 5 random jobs
    for (let seeker of createdSeekers) {
      // Shuffle jobs and pick 5
      const randomJobs = [...insertedJobs].sort(() => 0.5 - Math.random()).slice(0, 5);
      for (let job of randomJobs) {
        await Application.create({
          job: job._id,
          applicant: seeker._id,
          status: applicationStatuses[Math.floor(Math.random() * applicationStatuses.length)],
          resumeUrl: seeker.resumeUrl,
          resumeName: seeker.resumeName
        });
      }
    }
    console.log('Successfully simulated 15 applications!');
    console.log('Seeding Complete! Recruiter Dashboards are now populated with candidates.');
    
  } catch (err) {
    console.error('Error seeding DB:', err);
  }
};
