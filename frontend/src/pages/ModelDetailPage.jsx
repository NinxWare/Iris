import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { FileList } from '../components/FileList';
import { api } from '../services/api';

export const ModelDetailPage = () => {
  const { id } = useParams();
  const { data, refetch } = useQuery({
    queryKey: ['model', id],
    queryFn: async () => (await api.get(`/models/${id}`)).data,
  });

  const removeFile = async (fileId) => {
    try {
      await api.delete(`/models/${id}/files/${fileId}`);
      toast.success('Arquivo removido');
      refetch();
    } catch {
      toast.error('Sem permissão para remover arquivo');
    }
  };

  if (!data) return <main className="p-4">Carregando...</main>;

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <h1 className="text-3xl font-semibold">{data.name}</h1>
      <p className="text-slate-300">{data.description}</p>
      <a className="inline-block rounded bg-brand-600 px-4 py-2" href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/models/${id}/download-all`}>
        Baixar tudo (.zip)
      </a>
      <h2 className="mt-4 text-xl">Arquivos</h2>
      <FileList files={data.files} onDelete={removeFile} />
    </main>
  );
};
