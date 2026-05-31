import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

type Step = 'email' | 'otp' | 'reset';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (response.ok) {
        setStep('otp');
        setSuccess(result.message || 'OTP sent to your email!');
        setResendTimer(60);
      } else {
        setError(result.error || result.detail || 'Failed to send OTP.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const result = await response.json();

      if (response.ok) {
        setStep('reset');
        setSuccess('OTP verified! Set your new password.');
      } else {
        setError(result.error || result.detail || 'Invalid OTP.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.join(''),
          new_password: newPassword,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || result.detail || 'Failed to reset password.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message || 'OTP resent!');
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(result.error || 'Failed to resend OTP.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step indicator
  const steps = [
    { key: 'email', label: 'Email', num: 1 },
    { key: 'otp', label: 'Verify', num: 2 },
    { key: 'reset', label: 'Reset', num: 3 },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-2/3 relative bg-white flex-col justify-center overflow-hidden px-16 py-12">
        <div className="absolute -top-32 -left-32 w-64 h-64 blur-orb-primary pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 blur-orb-secondary pointer-events-none" />

        <div className="max-w-xl relative z-10 ml-8">
          <div className="w-24 h-1 bg-primary rounded-full mb-12" />
          <h1 className="font-display text-hero font-black mb-8 leading-tight">
            <span className="text-gradient-gray">AI-BASED</span><br />
            <span className="text-gradient-red">PRE-PLACEMENT</span><br />
            <span className="text-gradient-gray">TRAINER</span>
          </h1>
          <h2 className="text-subtitle text-gray-400 font-semibold mb-4">&amp; FEEDBACK MODEL</h2>
          <p className="text-xl text-gray-500 font-medium tracking-wide mb-12">Using Mock Aptitude and Interview</p>

          <div className="space-y-4">
            <FeatureItem icon={<LockIcon />} text="Secure Password Recovery" />
            <FeatureItem icon={<ShieldIcon />} text="OTP Verified Protection" />
            <FeatureItem icon={<KeyIcon />} text="Reset in 3 Simple Steps" />
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/3 bg-white flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-2">
              <img src="/logo.png" alt="LearnHub" className="w-10 h-10 object-contain" />
              <h1 className="text-3xl font-bold text-primary">LearnHub</h1>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i <= currentIdx
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {i < currentIdx ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      s.num
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${i <= currentIdx ? 'text-primary' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 mb-4 transition-all duration-300 ${i < currentIdx ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* === STEP 1: EMAIL === */}
          {step === 'email' && (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 font-sans mb-2">Forgot Password?</h2>
                <p className="text-sm text-gray-400">Enter your email and we'll send you a verification code</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-body focus:outline-none focus:border-primary focus:border-2 transition-all placeholder-gray-400"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{success}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-4 rounded-lg transition-all duration-200 uppercase text-sm tracking-wider shadow-button hover:shadow-card-hover ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {isLoading ? 'SENDING OTP...' : 'SEND OTP'}
                </button>
              </form>
            </>
          )}

          {/* === STEP 2: OTP VERIFICATION === */}
          {step === 'otp' && (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 font-sans mb-2">Verify OTP</h2>
                <p className="text-sm text-gray-400">
                  Enter the 6-digit code sent to <span className="font-semibold text-gray-600">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-all"
                    />
                  ))}
                </div>

                {/* Hint for dummy OTP */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium">
                    🔑 Demo Mode: Use OTP <span className="font-black text-blue-800 tracking-widest">123456</span>
                  </p>
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{success}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-4 rounded-lg transition-all duration-200 uppercase text-sm tracking-wider shadow-button hover:shadow-card-hover ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend OTP in <span className="font-bold text-primary">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-sm text-primary hover:underline font-bold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Change email */}
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
                  className="w-full text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  ← Change email address
                </button>
              </form>
            </>
          )}

          {/* === STEP 3: RESET PASSWORD === */}
          {step === 'reset' && (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 font-sans mb-2">Reset Password</h2>
                <p className="text-sm text-gray-400">Create a new password for your account</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg font-body focus:outline-none focus:border-primary focus:border-2 transition-all placeholder-gray-400"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg font-body focus:outline-none focus:border-primary focus:border-2 transition-all placeholder-gray-400"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">{success}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-4 rounded-lg transition-all duration-200 uppercase text-sm tracking-wider shadow-button hover:shadow-card-hover ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                </button>
              </form>
            </>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Icons
const FeatureItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-4 group cursor-pointer transition-transform duration-300 hover:translate-x-2">
    <div className="w-12 h-12 flex items-center justify-center bg-white border border-primary/30 rounded-xl transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <span className="text-primary font-medium">{text}</span>
  </div>
);

const LockIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
