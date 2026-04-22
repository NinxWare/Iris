import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ModelCard } from '../components/ModelCard';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ['models', search],
    queryFn: async () => (await api.get('/models', { params: { search } })).data,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2"
          placeholder="Buscar por nome ou descrição..."
        />
        {user && <Link to="/novo-modelo" className="rounded bg-brand-600 px-4 py-2">Novo modelo</Link>}
      </div>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.items?.map((model) => <ModelCard key={model.id} model={model} />)}
      </section>
    </main>
  );
};
