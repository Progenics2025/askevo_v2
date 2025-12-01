import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };



  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginForm.email, loginForm.password);
      navigate('/chat');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.register(
        registerForm.username,
        registerForm.email,
        registerForm.password,
        registerForm.firstName,
        registerForm.lastName
      );

      // Auto-login after registration
      const loginResponse = await authService.login(registerForm.email, registerForm.password);
      console.log('Registration and login successful:', loginResponse);
      navigate('/chat');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>askEVo</h1>
            <p>Your Genomics Intelligence Partner</p>
          </div>

          {error && (
            <div className="error-banner">
              <p>{error}</p>
            </div>
          )}

          {isLogin ? (
            // LOGIN FORM
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <h2>Sign In</h2>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="form-footer">
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                  >
                    Create one
                  </button>
                </p>
              </div>

              <div className="demo-info">
                <h4>Demo Credentials:</h4>
                <p><strong>Email:</strong> admin@progenics.com</p>
                <p><strong>Password:</strong> progenics123</p>
              </div>
            </form>
          ) : (
            // REGISTER FORM
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <h2>Create Account</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={registerForm.firstName}
                    onChange={handleRegisterChange}
                    placeholder="First name"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={registerForm.lastName}
                    onChange={handleRegisterChange}
                    placeholder="Last name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="form-footer">
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="login-background">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
          <div className="gradient-blob blob-3"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
