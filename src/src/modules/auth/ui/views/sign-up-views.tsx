'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

const MeetMeLogo = () => (
  <svg width="56" height="56" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="url(#grad)" />
    <text x="32" y="40" textAnchor="middle" fontSize="28" fill="#00FFC6" fontWeight="bold">🤝</text>
    <defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#2be9a7" />
        <stop offset="100%" stopColor="#111" />
      </radialGradient>
    </defs>
  </svg>
);

export const SignUpView = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = name && email && password && confirmPassword && passwordsMatch && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/',
      });
      setSuccessMessage('Account created successfully! Welcome aboard 🚀');
      // Optionally clear the form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign up';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-3xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl border-none bg-zinc-900">
        <div className="flex flex-col items-center justify-center md:basis-1/2 bg-gradient-to-br from-zinc-900 to-zinc-800 py-8 md:py-0 md:h-auto">
          <MeetMeLogo />
          <h2 className="mt-4 text-3xl font-bold text-white">Meet-Me</h2>
          <span className="mt-2 text-teal-300 text-sm font-medium hidden md:block">Create your account</span>
        </div>
        <CardContent className="flex flex-col justify-center md:basis-1/2 px-8 py-10">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
            <CardDescription className="text-zinc-400">Start your journey with us</CardDescription>
          </CardHeader>

          {/* Success message */}
          {successMessage && (
            <div className="mb-6 rounded-md border border-green-500 bg-green-900 px-4 py-3 text-green-400 text-center text-lg font-semibold drop-shadow-md">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 mt-2">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-base text-zinc-300">Full name</label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 px-3 py-2 rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-base text-zinc-300">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 px-3 py-2 rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-base text-zinc-300">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 px-3 py-2 rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-base text-zinc-300">Confirm password</label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 px-3 py-2 rounded-lg"
              />
            </div>

            {password && confirmPassword && !passwordsMatch ? (
              <div className="flex items-center gap-2 rounded-md border border-red-500 bg-red-950 px-3 py-2 text-sm text-red-300">
                <span className="text-xl">❗</span>
                <span>Passwords do not match</span>
              </div>
            ) : null}

            {error ? (
              <div className="flex items-center gap-2 rounded-md border border-red-500 bg-red-950 px-3 py-2 text-sm text-red-300">
                <span className="text-xl">❗</span>
                <span>{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-900 text-white font-semibold tracking-wide transition-colors hover:from-zinc-800 hover:to-zinc-900 disabled:opacity-60"
              disabled={!canSubmit}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <CardFooter className="justify-center pt-8 text-sm text-zinc-400">
            <span className="mr-1">Already have an account?</span>
            <a href="/sign-in" className="font-medium underline underline-offset-8 text-teal-300 hover:text-green-400">Sign in</a>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
