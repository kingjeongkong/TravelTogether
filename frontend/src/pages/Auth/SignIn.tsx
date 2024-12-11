import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormData, FormErrors } from '../../features/auth/types/authTypes';
import { validateSignInForm } from '../../features/auth/utils/validation';

import AuthLayout from '../../features/auth/components/Auth/AuthLayout';
import InputField from '../../features/auth/components/Auth/InputField';
import SubmitButton from '../../features/auth/components/Auth/SubmitButton';
import { authService } from '../../features/auth/services/authService';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');

    const formData: AuthFormData = {email, password};
    const validationErrors = validateSignInForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    const response = await authService.signIn(formData);
    setIsLoading(false);

    if (!response.success) {
      setAuthError(response.error?.message || 'An error occurred.');
      return;
    }

    navigate('/home');
  };

  return (
    <AuthLayout title="Sign in">
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fieldError={errors.email}
          authError={authError}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fieldError={errors.password}
          authError={authError}
          isLast={true}
        />
        {authError && (
          <p className="text-red-500 text-sm mb-1 pl-1">{authError}</p>
        )}
        <SubmitButton title="Sign In" isLoading={isLoading} />
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