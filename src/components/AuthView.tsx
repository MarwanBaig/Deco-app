import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  Mail,
  User
} from 'lucide-react';
import { getBackdropOption } from '../data/backdrops';
import { AppRoute, StudentUser, StudyBackdropId, UserProgress } from '../types/academic';

interface AuthViewProps {
  initialMode: 'login' | 'signup' | 'forgot';
  backdropId: StudyBackdropId;
  onAuthSuccess: (user: StudentUser & { progress?: Partial<UserProgress> | null }) => void;
  onNavigate: (route: AppRoute) => void;
}

export function AuthView({
  initialMode,
  backdropId,
  onAuthSuccess,
  onNavigate
}: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const selectedBackdrop = getBackdropOption(
    backdropId === 'minimal' ? 'mountains' : backdropId
  );

  const switchMode = (nextMode: 'login' | 'signup' | 'forgot') => {
    setMode(nextMode);
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid university or personal email address.');
      return;
    }

    if (mode === 'forgot') {
      setSubmitting(true);
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail })
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(
            data?.error ||
              'Password recovery emails require an external SMTP server configured on the host.'
          );
        } else {
          setInfoMsg(
            data?.message ||
              'If an account exists for that email, reset instructions have been sent.'
          );
        }
      } catch {
        setErrorMsg('Unable to contact the authentication server. Please verify the server is running.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (fullName.trim().length < 2) {
        setErrorMsg('Please enter your full name (at least 2 characters).');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter carefully.');
        return;
      }
    } else if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload =
        mode === 'signup'
          ? { fullName: fullName.trim(), email: trimmedEmail, password, confirmPassword }
          : { email: trimmedEmail, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data?.error || 'Authentication failed. Please check your details.');
        return;
      }

      if (data?.user) {
        onAuthSuccess(data.user);
        onNavigate({ page: 'dashboard' });
      }
    } catch {
      setErrorMsg('Network error reaching the authentication service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#FBFBF7] dark:bg-[#0D1512] p-4 sm:p-8 overflow-hidden">
      {/* Calm scenic backdrop framing the page softly */}
      {selectedBackdrop.imageUrl && (
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src={selectedBackdrop.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F241B]/80 via-[#0F241B]/65 to-[#0D1512]/80" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#DCE3DC]/80 dark:border-[#253830] bg-white/98 dark:bg-[#13201B]/98 shadow-2xl">
        {/* Left Peaceful Academic Context Panel */}
        <div className="lg:col-span-5 relative p-7 sm:p-8 flex flex-col justify-between bg-[#1B4332] text-white overflow-hidden">
          {selectedBackdrop.imageUrl && (
            <>
              <img
                src={selectedBackdrop.imageUrl}
                alt={selectedBackdrop.label}
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2118] via-[#1B4332]/75 to-[#1B4332]/60" />
            </>
          )}

          <div className="relative z-10 space-y-6">
            <button
              onClick={() => onNavigate({ page: 'welcome' })}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#D8E8DD] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Welcome Page</span>
            </button>

            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-white">
                <Leaf className="w-4 h-4 text-[#8CE0B0]" />
                <span>DECO ACADEMY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-balance">
                A calm, structured place to master Digital Electronics.
              </h1>
              <p className="text-sm text-[#D8E8DD] leading-relaxed">
                Sign in to keep your completed lessons, revision notes, quiz scores, and peaceful study backdrop synced across sessions.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-white/15 space-y-2 text-xs text-[#D8E8DD]">
            <p className="font-semibold text-white">U24EC304 · Digital Electronics &amp; Computer Organization</p>
            <p>All 5 syllabus units · Interactive Digital Lab · Engineering Doubt Assistant</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-9 space-y-6">
          {/* Tab switcher between Sign In and Sign Up */}
          <div className="flex items-center justify-between gap-4 border-b border-[#DCE3DC] dark:border-[#253830] pb-4">
            <div className="flex items-center gap-5 text-sm font-semibold">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`pb-1 transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'text-[#1B4332] dark:text-[#52B788] border-b-2 border-[#1B4332] dark:border-[#52B788]'
                    : 'text-[#52796F] dark:text-[#9CB3A6] hover:text-[#1F2933] dark:hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`pb-1 transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'text-[#1B4332] dark:text-[#52B788] border-b-2 border-[#1B4332] dark:border-[#52B788]'
                    : 'text-[#52796F] dark:text-[#9CB3A6] hover:text-[#1F2933] dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'dashboard' })}
              className="text-xs font-medium text-[#52796F] dark:text-[#9CB3A6] hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
            >
              Continue as Guest →
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2933] dark:text-[#EEF2EE]">
              {mode === 'login'
                ? 'Welcome back to your study space'
                : mode === 'signup'
                ? 'Create your student account'
                : 'Reset your account password'}
            </h2>
            <p className="text-sm text-[#52796F] dark:text-[#A4B8AC]">
              {mode === 'login'
                ? 'Enter your email and password to resume your DECO coursework.'
                : mode === 'signup'
                ? 'Track your progress across Units 1–5 and save your study preferences.'
                : 'Enter the email address associated with your DECO Academy account.'}
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1F2933] dark:text-[#DCE5DF]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Aarav Sharma"
                    autoComplete="name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-sm text-[#1F2933] dark:text-[#EEF2EE] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1F2933] dark:text-[#DCE5DF]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-sm text-[#1F2933] dark:text-[#EEF2EE] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#1F2933] dark:text-[#DCE5DF]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs font-medium text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-sm text-[#1F2933] dark:text-[#EEF2EE] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52796F] hover:text-[#1F2933] dark:hover:text-white cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1F2933] dark:text-[#DCE5DF]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#52796F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-sm text-[#1F2933] dark:text-[#EEF2EE] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52796F] hover:text-[#1F2933] dark:hover:text-white cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'login'
                      ? 'Signing in...'
                      : mode === 'signup'
                      ? 'Creating account...'
                      : 'Checking recovery options...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'Login to DECO Academy'
                      : mode === 'signup'
                      ? 'Create Student Account'
                      : 'Request Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#52796F] dark:text-[#A4B8AC]">
            {mode === 'login' ? (
              <span>
                New to DECO Academy?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-semibold text-[#1B4332] dark:text-[#52B788] hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-[#1B4332] dark:text-[#52B788] hover:underline cursor-pointer"
                >
                  Sign in instead
                </button>
              </span>
            )}

            <span>Local guest study remains available anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
