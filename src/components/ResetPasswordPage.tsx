// import React, { useState } from 'react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Eye, EyeOff } from 'lucide-react';
// import { supabase } from '../utils/supabase';

// interface ResetPasswordPageProps {
//   onNavigate: (screen: string) => void;
// }

// export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

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
//       console.log('🔐 Updating password...');
      
//       const { error: updateError } = await supabase.auth.updateUser({
//         password: password
//       });

//       if (updateError) {
//         console.error('❌ Password update failed:', updateError);
//         setError(updateError.message || 'Failed to update password');
//       } else {
//         console.log('✅ Password updated successfully!');
//         setSuccess(true);
//         setTimeout(() => {
//           onNavigate('auth');
//         }, 2000);
//       }
//     } catch (err: any) {
//       console.error('❌ Error updating password:', err);
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
//         <div className="mb-8" />

//         <Card className="max-w-md w-full border-gray-200">
//           <CardHeader>
//             <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
//               <span className="text-2xl">✓</span>
//             </div>
//             <CardTitle className="text-center">Password Updated!</CardTitle>
//           </CardHeader>
//           <CardContent className="text-center">
//             <p className="text-gray-600 mb-4">
//               Your password has been successfully updated.
//             </p>
//             <p className="text-sm text-gray-500">
//               Redirecting to sign in...
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
//       <div className="mb-8" />

//       <Card className="max-w-md w-full border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-center">Set New Password</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="password">New Password</Label>
//               <div className="relative w-full">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter new password (min. 6 characters)"
//                   required
//                   minLength={6}
//                   className="border-gray-300 w-full pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
//                   tabIndex={-1}
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? (
//                     <Eye className="w-5 h-5" />
//                   ) : (
//                     <EyeOff className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="confirmPassword">Confirm New Password</Label>
//               <div className="relative w-full">
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm new password"
//                   required
//                   className="border-gray-300 w-full pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-1"
//                   tabIndex={-1}
//                   aria-label="Toggle password visibility"
//                 >
//                   {showConfirmPassword ? (
//                     <Eye className="w-5 h-5" />
//                   ) : (
//                     <EyeOff className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-black text-white hover:bg-gray-800 py-3"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Updating password...</span>
//                 </div>
//               ) : (
//                 'Update Password'
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }























import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { auth } from '../utils/supabase';

interface ResetPasswordPageProps {
  onNavigate: (screen: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const result = await auth.resetPassword(email);
    
    if (result.success) {
      setMessage('Password reset link sent! Check your email.');
    } else {
      setError(result.error || 'Failed to send reset link');
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    // This assumes user clicked email link and is on #reset-password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (!updateError) {
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } else {
      setError(updateError.message || 'Failed to update password');
    }
    
    setIsLoading(false);
  };

  // Check if user came from email reset link
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('reset-password')) {
      setStep('reset');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === 'request' ? 'Reset Password' : 'Create New Password'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 text-green-600 p-3 rounded text-sm">
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Button 
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => onNavigate('login')}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 text-green-600 p-3 rounded text-sm">
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}