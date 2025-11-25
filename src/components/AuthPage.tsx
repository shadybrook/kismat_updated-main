
// // =============================================
// // FILE: src/components/AuthPage.tsx
// // Login/Signup with email and password
// // =============================================

// import React, { useState } from 'react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Eye, EyeOff } from 'lucide-react';
// import { auth } from '../utils/supabase';

// interface AuthPageProps {
//   onNavigate: (screen: string) => void;
// }

// export function AuthPage({ onNavigate }: AuthPageProps) {
//   const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     // Validation
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       console.log('🔐 Signing up with:', email);
//       console.log('📝 Password length:', password.length);
      
//       const result = await auth.signUp(email, password);
      
//       console.log('📋 Sign up result:', result);
      
//       if (result.success) {
//         console.log('✅ Sign up successful!');
//         console.log('👤 User:', result.user);
//         console.log('📧 Needs confirmation?', result.needsEmailConfirmation);
//         console.log('✓ Auto confirmed?', result.autoConfirmed);
        
//         if (result.needsEmailConfirmation) {
//           setSuccessMessage('⚠️ Account created but needs email verification. Check Supabase Dashboard > Authentication > Users and manually confirm your user, OR make sure "Confirm email" is disabled in Settings.');
//         } else if (result.autoConfirmed) {
//           setSuccessMessage('✅ Account created! Now try signing in with your email and password.');
//           setTimeout(() => {
//             // Clear password fields
//             setPassword('');
//             setConfirmPassword('');
//             switchMode('signin');
//           }, 2000);
//         } else {
//           setSuccessMessage('✅ Account created successfully! Redirecting...');
//         }
//       } else {
//         console.error('❌ Sign up failed:', result.error);
//         setError(`Sign up failed: ${result.error || 'Unknown error'}. Check console for details.`);
//       }
//     } catch (err: any) {
//       console.error('❌ Sign up error:', err);
//       setError(`Error: ${err.message || 'Something went wrong'}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setIsLoading(true);

//     try {
//       console.log('🔐 Signing in with:', email);
//       const result = await auth.signIn(email, password);
      
//       if (result.success) {
//         console.log('✅ Sign in successful!');
//         setSuccessMessage('Signed in successfully! Redirecting...');
//         // Auth state change will handle navigation
//       } else {
//         console.error('❌ Sign in failed:', result.error);
        
//         // Better error messages
//         if (result.error?.includes('Email not confirmed')) {
//           setError('Please verify your email before signing in. Check your inbox for the confirmation link.');
//         } else if (result.error?.includes('Invalid login credentials')) {
//           setError('Invalid email or password. Make sure "Confirm email" is disabled in Supabase Settings > Authentication > User Signups if you\'re testing.');
//         } else {
//           setError(result.error || 'Invalid email or password');
//         }
//       }
//     } catch (err: any) {
//       console.error('❌ Sign in error:', err);
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setIsLoading(true);

//     try {
//       console.log('🔐 Requesting password reset for:', email);
//       const result = await auth.resetPassword(email);
      
//       if (result.success) {
//         console.log('✅ Password reset email sent!');
//         setSuccessMessage('Password reset link sent! Check your email inbox. (Note: Email must be configured in Supabase to receive this)');
//         setTimeout(() => switchMode('signin'), 5000);
//       } else {
//         console.error('❌ Password reset failed:', result.error);
//         setError(result.error || 'Failed to send reset email');
//       }
//     } catch (err: any) {
//       console.error('❌ Password reset error:', err);
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//     setConfirmPassword('');
//     setError('');
//     setSuccessMessage('');
//   };

//   const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
//     resetForm();
//     setMode(newMode);
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
//       {/* Logo */}
//       <div className="mb-8">
//         <img 
//           alt="Kismat Logo" 
//           className="w-48 h-auto max-w-full mx-auto"
//         />
//       </div>

//       {/* Auth Form */}
//       <Card className="max-w-md w-full border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-center">
//             {mode === 'signin' && 'Sign in to Kismat'}
//             {mode === 'signup' && 'Create your account'}
//             {mode === 'reset' && 'Reset your password'}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {mode === 'signin' && (
//             <form onSubmit={handleSignIn} className="space-y-4">
//               <div>
//                 <Label htmlFor="email">Email address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   required
//                   className="border-gray-300"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative w-full">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     required
//                     className="border-gray-300 w-full pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
//                     tabIndex={-1}
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPassword ? (
//                       <Eye className="w-5 h-5" />
//                     ) : (
//                       <EyeOff className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               {successMessage && (
//                 <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
//                   {successMessage}
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-black text-white hover:bg-gray-800 py-3"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Signing in...</span>
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </Button>

//               <div className="text-center">
//                 <button
//                   type="button"
//                   onClick={() => switchMode('reset')}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   Forgot password?
//                 </button>
//               </div>
//             </form>
//           )}

//           {mode === 'signup' && (
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <div>
//                 <Label htmlFor="email">Email address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   required
//                   className="border-gray-300"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative w-full">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Create a password (min. 6 characters)"
//                     required
//                     minLength={6}
//                     className="border-gray-300 w-full pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
//                     tabIndex={-1}
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPassword ? (
//                       <Eye className="w-5 h-5" />
//                     ) : (
//                       <EyeOff className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative w-full">
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     placeholder="Confirm your password"
//                     required
//                     className="border-gray-300 w-full pr-12"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
//                     tabIndex={-1}
//                     aria-label="Toggle password visibility"
//                   >
//                     {showConfirmPassword ? (
//                       <Eye className="w-5 h-5" />
//                     ) : (
//                       <EyeOff className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               {successMessage && (
//                 <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
//                   {successMessage}
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-black text-white hover:bg-gray-800 py-3"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Creating account...</span>
//                   </div>
//                 ) : (
//                   'Create Account'
//                 )}
//               </Button>
//             </form>
//           )}

//           {mode === 'reset' && (
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
//                 <p className="text-xs text-yellow-800">
//                   ⚠️ <strong>Note:</strong> Password reset requires email configuration in Supabase. 
//                   For testing, you can:
//                   <br/>• Disable "Confirm email" in Supabase Settings
//                   <br/>• Create a new account
//                   <br/>• Or set up SMTP in Supabase for password reset emails
//                 </p>
//               </div>
              
//               <div>
//                 <Label htmlFor="email">Email address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   required
//                   className="border-gray-300"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   We'll send you a link to reset your password
//                 </p>
//               </div>

//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               {successMessage && (
//                 <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
//                   {successMessage}
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-black text-white hover:bg-gray-800 py-3"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Sending...</span>
//                   </div>
//                 ) : (
//                   'Send Reset Link'
//                 )}
//               </Button>

//               <div className="text-center">
//                 <button
//                   type="button"
//                   onClick={() => switchMode('signin')}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   Back to sign in
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Toggle between Sign In / Sign Up */}
//           {mode !== 'reset' && (
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 {mode === 'signin' ? (
//                   <>
//                     New to Kismat?{' '}
//                     <button
//                       onClick={() => switchMode('signup')}
//                       className="text-blue-600 font-semibold hover:underline"
//                     >
//                       Create an account
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     Already have an account?{' '}
//                     <button
//                       onClick={() => switchMode('signin')}
//                       className="text-blue-600 font-semibold hover:underline"
//                     >
//                       Sign in
//                     </button>
//                   </>
//                 )}
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <div className="mt-8 text-xs text-gray-400 text-center max-w-sm">
//         By continuing, you agree to Kismat's Terms of Service and Privacy Policy.
//       </div>
//     </div>
//   );
// }
































import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../utils/supabase';
import { BrandHeader } from './BrandHeader';

interface AuthPageProps {
  onNavigate: (screen: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Signing up with:', email);
      
      const result = await auth.signUp(email, password);
      
      console.log('📋 Sign up result:', result);
      
      if (result.success) {
        console.log('✅ Sign up successful!');
        
        if (result.needsEmailConfirmation) {
          setSuccessMessage('Account created! Please check your email to verify your account, or disable "Confirm email" in Supabase Settings.');
        } else if (result.autoConfirmed) {
          setSuccessMessage('✅ Account created! Signing you in...');
          setTimeout(() => {
            setPassword('');
            setConfirmPassword('');
          }, 1000);
        } else {
          setSuccessMessage('✅ Account created successfully!');
        }
      } else {
        console.error('❌ Sign up failed:', result.error);
        
        // Check if user already exists
        if (result.error?.includes('already registered') || result.error?.includes('already exists')) {
          setError('This email is already registered. Would you like to sign in instead?');
          setTimeout(() => switchMode('signin'), 3000);
        } else {
          setError(`Sign up failed: ${result.error || 'Unknown error'}`);
        }
      }
    } catch (err: any) {
      console.error('❌ Sign up error:', err);
      setError(`Error: ${err.message || 'Something went wrong'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      console.log('🔐 Signing in with:', email);
      const result = await auth.signIn(email, password);
      
      if (result.success) {
        console.log('✅ Sign in successful!');
        setSuccessMessage('Signed in successfully! Redirecting to dashboard...');
        // Auth state change will handle navigation
      } else {
        console.error('❌ Sign in failed:', result.error);
        
        // Better error messages
        if (result.error?.includes('Email not confirmed')) {
          setError('Please verify your email before signing in. Check your inbox for the confirmation link.');
        } else if (result.error?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(result.error || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      console.error('❌ Sign in error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      console.log('🔐 Requesting password reset for:', email);
      const result = await auth.resetPassword(email);
      
      if (result.success) {
        console.log('✅ Password reset email sent!');
        setSuccessMessage('Password reset link sent! Check your email inbox.');
        setTimeout(() => switchMode('signin'), 5000);
      } else {
        console.error('❌ Password reset failed:', result.error);
        setError(result.error || 'Failed to send reset email');
      }
    } catch (err: any) {
      console.error('❌ Password reset error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    resetForm();
    setMode(newMode);
  };

  const tabs: Array<{ key: 'signin' | 'signup' | 'reset'; label: string }> = [
    { key: 'signin', label: 'Sign in' },
    { key: 'signup', label: 'Create account' },
    { key: 'reset', label: 'Reset' },
  ];

  const titles = {
    signin: 'Sign in to Kismat',
    signup: 'Create your Kismat profile',
    reset: 'Reset your password',
  };

  return (
    <section className="kismat-screen" data-page="auth">
      <div className="kismat-panel kismat-panel--narrow">
        <div className="kismat-panel__content">
          <BrandHeader
            title={titles[mode]}
            subtitle="meet people based on personality"
          />

          <div className="kismat-toggle">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={mode === key ? 'active' : ''}
                onClick={() => switchMode(key)}
              >
                {label}
              </button>
            ))}
      </div>

          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="kismat-alert kismat-alert--info">
                Already part of the community? Sign in with your email and password to continue the journey.
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="kismat-alert kismat-alert--error">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="kismat-alert kismat-alert--success">
                  {successMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-base"
              >
                {isLoading ? 'Signing in…' : 'Sign in to dashboard'}
              </Button>

              <Button
                  type="button"
                variant="ghost"
                  onClick={() => switchMode('reset')}
                className="w-full kismat-btn--ghost text-sm"
                >
                  Forgot password?
              </Button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    required
                    minLength={6}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative w-full">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/70 hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="kismat-alert kismat-alert--error">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="kismat-alert kismat-alert--success">
                  {successMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-base"
              >
                {isLoading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="kismat-alert kismat-alert--info">
                Enter your email address and we'll send you a link to reset your password.
              </div>
              
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {error && (
                <div className="kismat-alert kismat-alert--error">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="kismat-alert kismat-alert--success">
                  {successMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-base"
              >
                {isLoading ? 'Sending link…' : 'Send reset link'}
              </Button>

              <Button
                  type="button"
                variant="ghost"
                  onClick={() => switchMode('signin')}
                className="w-full kismat-btn--ghost text-sm"
                >
                  Back to sign in
              </Button>
            </form>
          )}

          <p className="kismat-panel__footer">
            By continuing, you agree to Kismat&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
      </div>
    </section>
  );
}