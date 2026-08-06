import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error('Please enter the 6-digit OTP');
    
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
      if (res.data.success) {
        toast.success(res.data.message);
        // Correctly set user session after verification
        const userData = res.data.data;
        localStorage.setItem('careerConnect_token', userData.token);
        localStorage.setItem('careerConnect_user', JSON.stringify(userData));
        setUser(userData);
        navigate(`/dashboard/${userData.role}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Verify Your Email</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            We sent a 6-digit code to <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength="6"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter code"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            ) : null}
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Didn't receive the email? <Link to="/register" className="text-blue-600 hover:underline">Register again</Link>
        </p>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
