import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../Components/FormInput';
import { authService } from '../services/authService'; // Our new service

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', 'confirm-password': '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData['confirm-password']) {
      setError("Passwords do not match!");
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const { name, email, password } = formData;
      
      // 1. Call our *real* API service
      await authService.signup(name, email, password);
      
      // 2. On success, show an alert and send to login
      alert('Sign up successful! Please log in.');
      navigate('/login');

    } catch (err) {
      // 3. If the API fails (e.g., "User already exists"), set the error
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-y-6">
            <FormInput id="name" label="Full Name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            <FormInput id="email" label="Email address" type="email" placeholder="john.doe@example.com" value={formData.email} onChange={handleChange} />
            <FormInput id="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            <FormInput id="confirm-password" label="Confirm Password" type="password" placeholder="••••••••" value={formData['confirm-password']} onChange={handleChange} />
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;