import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';

dotenv.config();

const dummyJobs = [
  {
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced Frontend Developer proficient in React.js and modern CSS frameworks. You will be responsible for architecting and building complex user interfaces for our flagship SaaS product.',
    requirements: ['5+ years React experience', 'Tailwind CSS', 'Redux / Context API', 'TypeScript'],
    salary: '$120,000 - $150,000',
    location: 'Remote (US)',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    companyName: 'TechFlow Solutions',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=TechFlow&background=0D8ABC&color=fff',
  },
  {
    title: 'Backend Engineer (Node.js)',
    description: 'Join our backend team to build scalable microservices using Node.js, Express, and MongoDB. You will optimize database queries and ensure high performance of our APIs.',
    requirements: ['Node.js & Express', 'MongoDB / PostgreSQL', 'Docker', 'AWS'],
    salary: '$110,000 - $140,000',
    location: 'New York, NY',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    companyName: 'DataSphere',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=DataSphere&background=FF5733&color=fff',
  },
  {
    title: 'UI/UX Designer',
    description: 'We need a creative UI/UX designer to craft beautiful and intuitive user experiences. You will collaborate closely with product managers and engineers.',
    requirements: ['Figma', 'Prototyping', 'User Research', 'Adobe Creative Suite'],
    salary: '$90,000 - $120,000',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    companyName: 'CreativeEdge',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=CreativeEdge&background=8E44AD&color=fff',
  },
  {
    title: 'Product Manager',
    description: 'Lead the strategy and execution of our mobile application. You will gather requirements, write PRDs, and manage the sprint cycles.',
    requirements: ['Agile Methodology', 'Jira / Linear', 'Data Analytics', 'Cross-functional leadership'],
    salary: '$130,000 - $160,000',
    location: 'Remote (Global)',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    companyName: 'InnovateX',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=InnovateX&background=27AE60&color=fff',
  },
  {
    title: 'DevOps Engineer',
    description: 'Manage our cloud infrastructure and CI/CD pipelines. Ensure 99.9% uptime for our critical services and automate deployment processes.',
    requirements: ['Kubernetes', 'Terraform', 'AWS / GCP', 'Jenkins / GitHub Actions'],
    salary: '$140,000 - $170,000',
    location: 'Austin, TX',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    companyName: 'CloudNetics',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=CloudNetics&background=2980B9&color=fff',
  },
  {
    title: 'Marketing Specialist',
    description: 'Drive our social media campaigns and SEO strategy. You will be creating engaging content and analyzing marketing metrics to boost conversions.',
    requirements: ['SEO / SEM', 'Google Analytics', 'Content Creation', 'Social Media Management'],
    salary: '$60,000 - $80,000',
    location: 'London, UK (Hybrid)',
    jobType: 'Full-time',
    experienceLevel: 'Entry-Level',
    companyName: 'GrowthHackers',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=GrowthHackers&background=E67E22&color=fff',
  },
  {
    title: 'Full Stack MERN Developer',
    description: 'Looking for a versatile Full Stack Developer who can handle everything from MongoDB database design to React frontend implementation.',
    requirements: ['MongoDB', 'Express', 'React', 'Node.js'],
    salary: '$95,000 - $125,000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    companyName: 'StartupHub',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=StartupHub&background=16A085&color=fff',
  },
  {
    title: 'Data Scientist',
    description: 'Analyze complex datasets to extract actionable insights. Build predictive models using Python and machine learning frameworks.',
    requirements: ['Python', 'TensorFlow / PyTorch', 'SQL', 'Data Visualization (Tableau)'],
    salary: '$130,000 - $165,000',
    location: 'Boston, MA',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    companyName: 'Analytica',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=Analytica&background=C0392B&color=fff',
  },
  {
    title: 'Mobile App Developer (Flutter)',
    description: 'Build cross-platform mobile applications for iOS and Android using Flutter. Work with RESTful APIs to integrate backend services.',
    requirements: ['Flutter', 'Dart', 'State Management', 'REST APIs'],
    salary: '$100,000 - $130,000',
    location: 'Remote (Europe)',
    jobType: 'Contract',
    experienceLevel: 'Mid-Level',
    companyName: 'AppWorks',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=AppWorks&background=34495E&color=fff',
  },
  {
    title: 'Technical Writer',
    description: 'Create clear and concise documentation for our developer API. Write tutorials, guides, and reference materials.',
    requirements: ['Excellent English', 'Markdown', 'API Documentation', 'Basic Coding Knowledge'],
    salary: '$70,000 - $90,000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    companyName: 'DocuTech',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=DocuTech&background=F39C12&color=fff',
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Monitor our networks for security breaches and investigate violations. Implement security measures and conduct penetration testing.',
    requirements: ['Network Security', 'Penetration Testing', 'SIEM Tools', 'Incident Response'],
    salary: '$115,000 - $145,000',
    location: 'Washington, DC',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    companyName: 'SecureSystems',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=SecureSystems&background=2C3E50&color=fff',
  },
  {
    title: 'Graphic Designer',
    description: 'Create visual concepts to communicate ideas that inspire, inform, and captivate consumers. Design logos, brochures, and web graphics.',
    requirements: ['Illustrator', 'Photoshop', 'Typography', 'Creativity'],
    salary: '$55,000 - $75,000',
    location: 'Chicago, IL (Hybrid)',
    jobType: 'Full-time',
    experienceLevel: 'Entry-Level',
    companyName: 'PixelPerfect',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=PixelPerfect&background=D35400&color=fff',
  },
  {
    title: 'Sales Representative',
    description: 'Identify leads, pitch our software solutions to enterprise clients, and close deals. Excellent communication skills required.',
    requirements: ['B2B Sales', 'CRM (Salesforce)', 'Negotiation', 'Cold Calling'],
    salary: '$70,000 + Commission',
    location: 'Dallas, TX',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    companyName: 'EnterpriseSolutions',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=Enterprise&background=7F8C8D&color=fff',
  },
  {
    title: 'Quality Assurance Tester',
    description: 'Ensure our web applications are bug-free before release. Write automated test scripts and perform manual testing.',
    requirements: ['Selenium', 'Cypress', 'Manual Testing', 'Bug Tracking (Jira)'],
    salary: '$80,000 - $100,000',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    companyName: 'QualityFirst',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=QualityFirst&background=1ABC9C&color=fff',
  },
  {
    title: 'Blockchain Developer',
    description: 'Develop and deploy smart contracts on the Ethereum network. Work on cutting-edge Web3 and DeFi protocols.',
    requirements: ['Solidity', 'Web3.js / Ethers.js', 'Smart Contracts', 'Cryptography'],
    salary: '$150,000 - $200,000',
    location: 'Remote (Global)',
    jobType: 'Contract',
    experienceLevel: 'Senior',
    companyName: 'CryptoInnovate',
    companyLogoUrl: 'https://ui-avatars.com/api/?name=Crypto&background=F1C40F&color=fff',
  }
];

export const seedDB = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount > 0) {
      console.log('Database already seeded with jobs. Skipping seed.');
      return;
    }

    console.log('Seeding Database...');

    // Find or create a dummy recruiter
    let recruiter = await User.findOne({ email: 'recruiter@dummy.com' });
    if (!recruiter) {
      console.log('Creating dummy recruiter...');
      recruiter = await User.create({
        name: 'John Recruiter',
        email: 'recruiter@dummy.com',
        password: 'password123', // Doesn't matter for seeding jobs
        role: 'recruiter',
        isVerified: true
      });
    }

    console.log('Inserting new jobs...');
    const jobsWithRecruiter = dummyJobs.map(job => ({
      ...job,
      recruiter: recruiter._id,
    }));

    await Job.insertMany(jobsWithRecruiter);
    console.log('Successfully seeded 15 jobs!');
  } catch (err) {
    console.error('Error seeding DB:', err);
  }
};
