import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../services/api';

const fakeInference = async (text, modelName) => {
  const delay = 800 + Math.floor(Math.random() * 1800);
  await new Promise((resolve) => setTimeout(resolve, delay));
  const score = Math.random();
  const label = score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral';
  return {
    model: modelName,
    input: text,
    latencyMs: delay,
    result: { label, confidence: Number((0.65 + Math.random() * 0.34).toFixed(3)) },
  };
};

export const TestAIPage = () => {
  const { data } = useQuery({ queryKey: ['models-dropdown'], queryFn: async () => (await api.get('/models', { params: { limit: 100 } })).data });
  const [text, setText] = useState('');
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const run = async () => {
    const model = data?.items?.find((m) => m.id === selected);
    if (!model || !text.trim()) return;
    setLoading(true);
    setOutput(await fakeInference(text, model.name));
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">Testar IA</h1>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded bg-slate-900 p-2">
        <option value="">Selecione um modelo</option>
        {data?.items?.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full rounded bg-slate-900 p-2" placeholder="Digite um texto para análise..." />
      <button onClick={run} disabled={loading} className="rounded bg-brand-600 px-4 py-2 disabled:opacity-70">
        {loading ? 'Processando...' : 'Executar inferência'}
      </button>
      {output && <pre className="overflow-auto rounded bg-slate-900 p-4 text-xs">{JSON.stringify(output, null, 2)}</pre>}
    </main>
  );
};
