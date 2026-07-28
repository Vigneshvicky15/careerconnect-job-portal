import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google DNS, bypassing local network DNS SRV failures
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://vigneshvel515_db_user:vignesh2004@cluster0.8fvmdgt.mongodb.net/careerconnect?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
  try {
    await mongoose.connect(uri);
    console.log('SUCCESS!');
    process.exit(0);
  } catch (err) {
    console.error('FAIL:', err.message);
    process.exit(1);
  }
}

test();
