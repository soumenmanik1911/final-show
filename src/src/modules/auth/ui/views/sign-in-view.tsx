// 'use client';

// import * as React from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { authClient } from '@/lib/auth-client';

// export const SignInView = () => {
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setError(null);
//     setIsSubmitting(true);
//     try {
//       await authClient.signIn.email({
//         email,
//         password,
//         callbackURL: '/',
//       });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Unable to sign in';
//       setError(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   return (
//     <div className="mx-auto w-full max-w-5xl p-4 sm:p-6">
//       <Card className="overflow-hidden bg-black text-white border-zinc-800">
//         <CardContent className="p-0">
//           <div className="grid md:grid-cols-2">
//             <div className="p-6 md:p-8">
//               <CardHeader className="p-0 pb-4">
//                 <CardTitle className="text-2xl">Welcome back</CardTitle>
//                 <CardDescription className="text-zinc-400">
//                   Login to your account
//                 </CardDescription>
//               </CardHeader>
//               <form onSubmit={handleSubmit} className="grid gap-4">
//             <div className="grid gap-2">
//               <label htmlFor="email" className="text-sm font-medium">
//                 Email
//               </label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 autoComplete="email"
//                 className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
//               />
//             </div>
//             <div className="grid gap-2">
//               <label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 autoComplete="current-password"
//                 className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
//               />
//             </div>

//             {error ? (
//               <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
//                 {error}
//               </div>
//             ) : null}

//             <button
//               type="submit"
//               className="inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-60"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Signing in…' : 'Sign in'}
//             </button>
//               </form>
//               <CardFooter className="justify-center px-0 pt-4 text-sm text-zinc-400">
//                 <span className="mr-1">Don\'t have an account?</span>
//                 <a href="/sign-up" className="font-medium underline underline-offset-4 text-white">
//                   Create one
//                 </a>
//               </CardFooter>
//             </div>

//             <div className="relative hidden md:block">
//               <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
//               <div className="relative flex h-full items-center justify-center p-8">
//                 <div className="h-40 w-40 rounded-full bg-gradient-to-r from-white/20 to-white/0 ring-1 ring-white/10" />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };


'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';

// Example Meet-Me Logo Component (SVG/emoji/image)
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

export const SignInView = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: '/',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-3xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl border-none bg-zinc-900">
        {/* Meet-Me Section: Always visible & responsive */}
        <div className="flex flex-col items-center justify-center md:basis-1/2 bg-gradient-to-br from-zinc-900 to-zinc-800 py-8 md:py-0 md:h-auto">
          <MeetMeLogo />
          <h2 className="mt-4 text-3xl font-bold text-white md:mb-0">Meet-Me</h2>
          <span className="mt-2 text-teal-300 text-sm font-medium hidden md:block">Your AI Connect</span>
        </div>
        {/* Sign-in Form Section */}
        <CardContent className="flex flex-col justify-center md:basis-1/2 px-8 py-10">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-zinc-400">Login to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="grid gap-5 mt-8">
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
                autoComplete="current-password"
                className="bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 px-3 py-2 rounded-lg"
              />
            </div>
            {error ? (
              <div className="flex items-center gap-2 rounded-md border border-red-500 bg-red-950 px-3 py-2 text-sm text-red-300">
                <span className="text-xl">❗</span>
                <span>{error}</span>
              </div>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-900 text-white font-semibold tracking-wide transition-colors hover:from-zinc-800 hover:to-zinc-900 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <CardFooter className="justify-center pt-8 text-sm text-zinc-400">
            <span className="mr-1">Don't have an account?</span>
            <a href="/sign-up" className="font-medium underline underline-offset-8 text-teal-300 hover:text-green-400">Create one</a>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
