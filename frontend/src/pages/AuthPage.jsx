import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema, registerSchema } from '../schemas/authSchemas';

export const AuthPage = () => {
  const [mode, setMode] = useState('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const schema = mode === 'login' ? loginSchema : registerSchema;

  const { register: hook, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      if (mode === 'login') {
        await login(values);
        toast.success('Login realizado');
      } else {
        await register(values);
        toast.success('Cadastro realizado, agora faça login');
        setMode('login');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro inesperado');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
        {mode === 'register' && <input {...hook('name')} placeholder="Nome" className="w-full rounded bg-slate-800 p-2" />}
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        <input {...hook('email')} placeholder="E-mail" className="w-full rounded bg-slate-800 p-2" />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        <input {...hook('password')} type="password" placeholder="Senha" className="w-full rounded bg-slate-800 p-2" />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        <button className="w-full rounded bg-brand-600 p-2">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-sm text-brand-500">
          {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
        </button>
      </form>
    </main>
  );
};
