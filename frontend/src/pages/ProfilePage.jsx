import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Upload,
  FileText,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useContext(AuthContext);

  // Form Fields State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  
  // File uploads
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // Experience and Education list states
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  // Temp item builders
  const [tempExp, setTempExp] = useState({ company: '', role: '', description: '', current: false });
  const [tempEdu, setTempEdu] = useState({ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setTitle(user.title || '');
      setBio(user.bio || '');
      setSkills(user.skills ? user.skills.join(', ') : '');
      setExperience(user.experience || []);
      setEducation(user.education || []);
      if (user.profilePhotoUrl) {
        setPhotoPreview(user.profilePhotoUrl);
      }
    }
  }, [user]);

  // Calculate Profile Completion Percentage
  const getCompletionPercentage = () => {
    if (!user) return 0;
    let score = 0;
    if (name) score += 20;
    if (user.profilePhotoUrl || photoPreview) score += 20;
    if (bio || title) score += 20;
    if (skills) score += 20;
    if (user.role === 'seeker') {
      if (user.resumeUrl || resumeFile) score += 20;
    } else {
      score += 20; // Recruiters don't require resumes, auto credit
    }
    return score;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  // Add Experience array item helper
  const addExperience = () => {
    if (!tempExp.company || !tempExp.role) {
      return toast.error('Company and Role are required to add experience.');
    }
    setExperience([...experience, tempExp]);
    setTempExp({ company: '', role: '', description: '', current: false });
    toast.success('Experience item added to draft.');
  };

  // Add Education array item helper
  const addEducation = () => {
    if (!tempEdu.institution || !tempEdu.degree) {
      return toast.error('Institution and Degree are required to add education.');
    }
    setEducation([...education, tempEdu]);
    setTempEdu({ institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' });
    toast.success('Education item added to draft.');
  };

  const removeExperience = (idx) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const removeEducation = (idx) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('title', title);
    formData.append('bio', bio);
    formData.append('skills', JSON.stringify(skills.split(',').map(s => s.trim()).filter(Boolean)));
    formData.append('experience', JSON.stringify(experience));
    formData.append('education', JSON.stringify(education));

    if (profilePhotoFile) {
      formData.append('profilePhoto', profilePhotoFile);
    }

    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    const res = await updateProfile(formData);
    if (res && res.success) {
      // Clear files state
      setProfilePhotoFile(null);
      setResumeFile(null);
    }
  };

  const percentage = getCompletionPercentage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Avatar & Profile Strength bar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl text-center space-y-6">
            <div className="relative w-32 h-32 mx-auto">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-4 border-primary-500/10"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                  <UserIcon size={48} />
                </div>
              )}
              <label className="absolute bottom-1 right-1 p-2 bg-primary-500 hover:bg-primary-600 rounded-full text-white cursor-pointer shadow-md transition-colors">
                <Upload size={14} />
                <input type="file" onChange={handlePhotoChange} className="hidden" accept="image/*" />
              </label>
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{name || 'Your Name'}</h3>
              <p className="text-xs text-slate-400 capitalize font-medium">{user?.role || 'User'}</p>
            </div>

            {/* Completion indicator */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Profile Strength</span>
                <span className="text-primary-500">{percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile details form */}
        <div className="lg:col-span-3 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase block">Professional Title</label>
                  <input
                    type="text"
                    placeholder="Full Stack Engineer, Recruiter Manager..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase block">Bio / Summary</label>
                <textarea
                  rows={4}
                  placeholder="Tell recruiters about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Skills & Resume (Seeker Specific) */}
            {user?.role === 'seeker' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Skills & Credentials
                </h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase block flex items-center gap-1">
                    <Tag size={12} />
                    Skills (Comma separated list)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Express, MongoDB, TailwindCSS"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-sm outline-none focus:border-primary-500"
                  />
                </div>
                {/* Resume upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase block">Resume PDF</label>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {resumeFile ? resumeFile.name : user?.resumeName || 'No Resume Uploaded'}
                      </h4>
                      <p className="text-xs text-slate-400">PDF formats under 10MB allowed</p>
                    </div>
                    <label className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                      Choose PDF
                      <input type="file" onChange={handleResumeChange} className="hidden" accept=".pdf" />
                    </label>
                  </div>
                  {user?.resumeUrl && (
                    <a
                      href={user.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary-500 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <CheckCircle size={12} />
                      View Current Resume Link
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Experience list builder */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Work Experience
              </h3>

              {experience.length > 0 && (
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl">
                      <div className="flex gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl h-fit">
                          <Briefcase size={18} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{exp.role}</h4>
                          <p className="text-xs text-slate-500">{exp.company}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Form segment to add experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <input
                  type="text"
                  placeholder="Company"
                  value={tempExp.company}
                  onChange={(e) => setTempExp({ ...tempExp, company: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={tempExp.role}
                  onChange={(e) => setTempExp({ ...tempExp, role: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                />
                <textarea
                  placeholder="Experience Description..."
                  value={tempExp.description}
                  onChange={(e) => setTempExp({ ...tempExp, description: e.target.value })}
                  className="sm:col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="sm:col-span-2 flex items-center justify-center gap-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-950/30 rounded-xl transition-all border border-indigo-200/50 dark:border-indigo-900/35"
                >
                  <Plus size={14} /> Add Experience Item
                </button>
              </div>
            </div>

            {/* Education list builder */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Education
              </h3>

              {education.length > 0 && (
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 p-4 rounded-2xl">
                      <div className="flex gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl h-fit">
                          <GraduationCap size={18} />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <p className="text-xs text-slate-500">{edu.institution}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-950/25 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Form segment to add education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <input
                  type="text"
                  placeholder="Institution"
                  value={tempEdu.institution}
                  onChange={(e) => setTempEdu({ ...tempEdu, institution: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Degree (e.g. Bachelor of Science)"
                  value={tempEdu.degree}
                  onChange={(e) => setTempEdu({ ...tempEdu, degree: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={tempEdu.fieldOfStudy}
                  onChange={(e) => setTempEdu({ ...tempEdu, fieldOfStudy: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                />
                <input
                  type="number"
                  placeholder="End Year"
                  value={tempEdu.endYear}
                  onChange={(e) => setTempEdu({ ...tempEdu, endYear: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="sm:col-span-2 flex items-center justify-center gap-1 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-xl transition-all border border-emerald-200/50 dark:border-emerald-900/35"
                >
                  <Plus size={14} /> Add Education Item
                </button>
              </div>
            </div>

            {/* Save Profile Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-4 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 rounded-2xl transition-all shadow-md shadow-primary-500/20 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={16} />
                  Save Profile Settings
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
