import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '../../features/auth/components/AuthLayout';
import InputField from '../../features/auth/components/InputField';
import SubmitButton from '../../features/auth/components/SubmitButton';
import { useAuthSubmit } from '../../features/auth/hooks/useAuthSubmit';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isLoading, errors, authError, handleSubmit } = useAuthSubmit({
    type: 'signUp',
    redirectPath: '/'
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit({ name, email, password, confirmPassword });
  };

  return (
    <AuthLayout title="Sign Up">
      <form onSubmit={onSubmit}>
        <InputField
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          fieldError={errors.name}
        />
        <InputField
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          fieldError={errors.email}
          authError={authError}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          fieldError={errors.password}
          authError={authError}
        />
        <InputField
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
          fieldError={errors.confirmPassword}
          authError={authError}
          isLast={true}
        />
        {authError && <p className="text-red-500 text-sm mb-2 pl-1">{authError}</p>}
        <SubmitButton title="Sign Up" isLoading={isLoading} />
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?
        <Link to="/" className="text-indigo-600 ml-4">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUpPage;
