import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import '../styles/LoginPage.css';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [init, setInit] = useState(false);

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const particlesOptions = {
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            opacity: 1,
          },
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: "bounce",
        random: false,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 120,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
    },
    detectRetina: true,
  };


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
      {/* Background elements */}
      <div className="background-container">
        {init && <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={particlesOptions} className="particles-canvas" />}
      </div>

      {/* Login Form Container */}
      <div className="login-container">
        <div className="login-box">
          <div className="logo-placeholder">Logo</div>
          <h1 className="app-title">askEVO</h1>
          <p className="app-subtitle">
            {isLogin ? 'Welcome back! Please log in to your account.' : 'Create your account to get started.'}
          </p>

          {error && (
            <div className="error-banner">
              <p>{error}</p>
            </div>
          )}

          {isLogin ? (
            // LOGIN FORM
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="admin@progenics.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="input-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="progenics123"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <button
                type="button"
                className="toggle-link"
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                Don't have an account? Create one
              </button>

              <div className="demo-info" style={{ marginTop: '20px', fontSize: '0.8rem', color: '#a0a0a0' }}>
                <p>Demo: admin@progenics.com / progenics123</p>
              </div>
            </form>
          ) : (
            // REGISTER FORM
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="firstName" className="input-label">First Name</label>
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
              <div className="input-group">
                <label htmlFor="lastName" className="input-label">Last Name</label>
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
              <div className="input-group">
                <label htmlFor="username" className="input-label">Username</label>
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
              <div className="input-group">
                <label htmlFor="reg-email" className="input-label">Email Address</label>
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
              <div className="input-group">
                <label htmlFor="reg-password" className="input-label">Password</label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Min 6 characters"
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirm password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <button
                type="button"
                className="toggle-link"
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                Already have an account? Sign in
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Branding Element */}
      <div className="branding-corner">
        <span>Powered by</span>
        <strong>Progenics</strong>
      </div>
    </div>
  );
};

export default LoginPage;
