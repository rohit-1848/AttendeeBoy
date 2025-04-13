import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import brainFlowerIcon from '../assets/logo.png';
import '../css/Login.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const otpResponse = await fetch('http://localhost:8000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, requestType: 'signup' }),
        credentials: 'include',
      });

      if (!otpResponse.ok) {
        const otpErrorData = await otpResponse.json();
        let errorMessage = otpErrorData.detail?.[0]?.msg || otpErrorData.detail || 'Failed to send OTP';
        throw new Error(errorMessage);
      }

      setShowOtpModal(true);
      setError('');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, requestType: 'signup' }),
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setError('');
      const tempAlert = document.createElement('div');
      tempAlert.className = 'custom-alert custom-alert-info';
      tempAlert.innerHTML = `
        <div class="custom-alert-content">
          <span>OTP has been resent to your email</span>
          <button class="custom-alert-close">&times;</button>
        </div>
      `;
      document.body.appendChild(tempAlert);

      setTimeout(() => {
        if (tempAlert.parentNode) document.body.removeChild(tempAlert);
      }, 3000);

      const closeBtn = tempAlert.querySelector('.custom-alert-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (tempAlert.parentNode) document.body.removeChild(tempAlert);
        });
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const verifyResponse = await fetch('http://localhost:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, requestType: 'signup' }),
        credentials: 'include',
      });

      if (!verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        throw new Error(verifyData.message || 'Invalid OTP');
      }

      const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: username, roll_number: rollNumber }),
        credentials: 'include',
      });

      if (!registerResponse.ok) {
        const registerData = await registerResponse.json();
        throw new Error(registerData.message || 'Failed to create account');
      }

      setShowSuccessAlert(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Error during verification/registration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessAlert = () => {
    setShowSuccessAlert(false);
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="logo-text">
          <h1>AttendeeBoy</h1>
        </div>
      </div>

      <div className="right-section">
        <div className="brain-flower-icon">
          <img src={brainFlowerIcon} alt="Brain flower icon" />
        </div>
      </div>

      <div className="login-form-wrapper">
        <div className="login-form">
          {!showOtpModal ? (
            <>
              <div className="form-header">
                <p className="welcome-text">Welcome to AttendeeBoy</p>
                <h1 className="sign-in-heading">Sign up</h1>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Enter email address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Enter Name</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="roll-number">Enter Roll Number</label>
                  <input
                    id="roll-number"
                    type="text"
                    placeholder="Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-field">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Set Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="password-field">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (password && e.target.value !== password) setError('Passwords do not match');
                        else setError('');
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="sign-in-btn" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Sign Up'}
                </button>

                <div className="no-account">
                  <span>Already have an account?</span>
                  <a href="/">Sign in</a>
                </div>
              </form>
            </>
          ) : (
            <div className="otp-verification">
              <div className="form-header">
                <h1 className="sign-in-heading">Verify OTP</h1>
                <p>We've sent a verification code to your email address.</p>
              </div>

              <div className="form-group">
                <label htmlFor="otp-input">Enter OTP</label>
                <input
                  id="otp-input"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 6) setOtp(value);
                  }}
                  maxLength="6"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button onClick={verifyOtp} className="sign-in-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>

              <div className="no-account">
                <span>Didn't receive OTP?</span>
                <button
                  onClick={resendOtp}
                  className="resend-otp-btn"
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSuccessAlert && (
        <div className="custom-alert-overlay">
          <div className="custom-success-alert">
            <div className="success-icon">✓</div>
            <h2>Account Created Successfully!</h2>
            <p>You will be redirected to login page shortly.</p>
            <button onClick={closeSuccessAlert} className="close-alert-btn">
              Continue to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;