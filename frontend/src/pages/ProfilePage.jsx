import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const ProfilePage = () => {
  const { data } = useQuery({ queryKey: ['me'], queryFn: async () => (await api.get('/users/me')).data });

  if (!data) return <main className="p-6">Carregando...</main>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Meu perfil</h1>
        <p className="mt-2 text-slate-300">Nome: {data.name}</p>
        <p className="text-slate-300">E-mail: {data.email}</p>
      </div>
    </main>
  );
};
