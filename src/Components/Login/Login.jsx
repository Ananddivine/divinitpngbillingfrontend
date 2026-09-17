import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axiosInstance/axiosInstance';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();
    if (expirationTime && currentTime > expirationTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('tokenExpiration');
      setToken('');
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/admin/adminlogin', { email, password });

      if (response.data.success) {
        const token = response.data.token;
        const uniqToken = response.data.uniqToken; // No hashing needed

        // Store values in localStorage
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('uniqToken', uniqToken); // Store raw uniqToken

        // Set token expiration (12 hours)
        const expirationTime = new Date().getTime() + 12 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime);

        toast.success('Login Successful');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_28%),linear-gradient(135deg,#f7efe3_0%,#f3eadc_35%,#e5efe9_100%)] px-6 py-10 font-poppins">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] p-8 shadow-[0_18px_45px_rgba(73,47,24,0.08)] md:p-10">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">SKYLAP IT SOLUTIONS</span>
          <h2 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            A calmer workspace for billing, stock, and daily admin tasks.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
            Manage sales, invoices, products, and operational tasks from a cleaner control center built for quick scanning and fewer mistakes.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[#dfd3c3] bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Billing</p>
              <p className="mt-2 text-sm text-stone-700">Create invoices with clearer number tracking and print-ready outputs.</p>
            </div>
            <div className="rounded-3xl border border-[#dfd3c3] bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Inventory</p>
              <p className="mt-2 text-sm text-stone-700">Keep stock, products, and customer records visible in one place.</p>
            </div>
            <div className="rounded-3xl border border-[#dfd3c3] bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Tasks</p>
              <p className="mt-2 text-sm text-stone-700">Track pending work and dashboard summaries without clutter.</p>
            </div>
          </div>
        </div>

      <div className='mx-auto w-full max-w-md rounded-[32px] border border-[#dfd3c3] bg-[linear-gradient(180deg,rgba(255,253,250,0.98),rgba(255,248,239,0.96))] px-8 py-8 shadow-[0_18px_45px_rgba(73,47,24,0.08)] md:px-10 md:py-10'>
        <p className="mb-4 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Secure Access</p>
        <h1 className='mb-2 text-3xl font-semibold text-slate-900'>Login</h1>
        <p className="mb-6 text-sm text-stone-600">Use your admin credentials to continue.</p>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-stone-600'>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='w-full rounded-2xl border border-[#dfd3c3] bg-white px-4 py-3 outline-none transition duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
              type='email'
              placeholder='Email id'
              name='email'
              required
            />
          </div>
          <div>
            <p className='mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-stone-600'>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='w-full rounded-2xl border border-[#dfd3c3] bg-white px-4 py-3 outline-none transition duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100'
              type='password'
              placeholder='Password'
              name='password'
              required
            />
          </div>
          <button
            className='mt-4 flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#115e59)] px-4 py-3 text-white shadow-[0_12px_24px_rgba(15,118,110,0.24)] transition duration-200 hover:brightness-105'
            type='submit'
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            ) : null}
            Submit
          </button>
        </form>
      </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
