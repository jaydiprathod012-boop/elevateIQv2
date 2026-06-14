import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/store/auth.context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: FormData) => {
    try { setError(''); await login(data.email, data.password); }
    catch (err: unknown) { const e = err as { response?: { data?: { error?: string } } }; setError(e.response?.data?.error || 'Login failed'); }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/10 pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-12 h-12 gradient-neon rounded-2xl flex items-center justify-center neon-glow-purple">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-neon-text">ElevateIQ</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to continue your journey</p>
        </div>

        <div className="bg-card rounded-2xl neon-border-purple p-8">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-gray-300">Email</Label>
              <Input type="email" placeholder="you@example.com" {...register('email')}
                className="bg-secondary border-purple-500/30 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 focus-visible:border-purple-400" />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300">Password</Label>
              <div className="relative">
                <Input type={showPwd ? 'text' : 'password'} placeholder="Enter password" {...register('password')}
                  className="bg-secondary border-purple-500/30 text-white placeholder:text-gray-600 focus-visible:ring-purple-500 pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" variant="gradient" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/register" className="text-neon-purple font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
