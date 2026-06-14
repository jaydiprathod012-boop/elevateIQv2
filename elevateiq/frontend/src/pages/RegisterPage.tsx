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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: authRegister, isAuthenticated } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (data: FormData) => {
    try { setError(''); await authRegister(data.name, data.email, data.password); }
    catch (err: unknown) { const e = err as { response?: { data?: { error?: string } } }; setError(e.response?.data?.error || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/15 via-background to-purple-900/20 pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-12 h-12 gradient-neon rounded-2xl flex items-center justify-center neon-glow-purple">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl gradient-neon-text">ElevateIQ</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-muted-foreground">Start your AI career journey today — free</p>
        </div>

        <div className="bg-card rounded-2xl neon-border-cyan p-8">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-gray-300">Full Name</Label>
              <Input placeholder="Jay Sharma" {...register('name')}
                className="bg-secondary border-cyan-500/30 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500" />
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300">Email</Label>
              <Input type="email" placeholder="you@example.com" {...register('email')}
                className="bg-secondary border-cyan-500/30 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500" />
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-300">Password</Label>
              <div className="relative">
                <Input type={showPwd ? 'text' : 'password'} placeholder="Min 8 characters" {...register('password')}
                  className="bg-secondary border-cyan-500/30 text-white placeholder:text-gray-600 focus-visible:ring-cyan-500 pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" variant="gradient" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-cyan font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
