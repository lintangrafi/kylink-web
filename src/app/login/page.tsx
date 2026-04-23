'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { verifyInviteCode } from '@/actions/auth-actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const verify = await verifyInviteCode(inviteCode);
        if (verify.error) {
          setError(verify.error);
          setLoading(false);
          return;
        }

        const { error: signUpError } = await authClient.signUp.email({
            email,
            password,
            name: email.split('@')[0], 
        });
        if (signUpError) {
          setError(signUpError.message || 'Registration failed');
          setLoading(false);
          return;
        }
      } 
      
      const { error: signInError } = await authClient.signIn.email({
          email,
          password
      });

      if (signInError) {
        setError(signInError.message || 'Login failed');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-none rounded-none sm:rounded-lg sm:border border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-blue-600">KyLink</CardTitle>
          <CardDescription>
            {isRegistering ? 'Create your account to start managing links.' : 'Enter your email to sign in to your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-md border-slate-300 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-md border-slate-300 focus:ring-blue-600"
              />
            </div>
            
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Admin Invite Code</Label>
                <Input
                  id="inviteCode"
                  type="password"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  required
                  placeholder="Required for registration"
                  className="rounded-md border-slate-300 focus:ring-blue-600"
                />
              </div>
            )}

            <Button className="w-full rounded-md font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-none transition-colors" type="submit" disabled={loading}>
              {loading ? 'Processing...' : (isRegistering ? 'Sign Up as Admin' : 'Sign In')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-slate-500 hover:text-slate-900 font-medium"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
