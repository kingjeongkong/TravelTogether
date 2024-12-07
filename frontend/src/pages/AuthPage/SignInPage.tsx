import React, { useState } from 'react';
import AuthLayout from '../../components/Auth/AuthLayout';
import InputField from '../../components/Auth/InputField';
import SubmitButton from '../../components/Auth/SubmitButton';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validationForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationForm()) {
      console.log('Login attempt with', { email, password });
    }
  };

  return (
    <AuthLayout title="Sign in">
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <SubmitButton title="Sign In" />
      </form>

      <div className="flex items-center justify-between mt-6">
        <Link to="#" className="text-indigo-600 hover:underline">
          Forgot password?
        </Link>
        <Link to="/sign-up" className="text-indigo-600 hover:underline">
          Don't have an account?
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
