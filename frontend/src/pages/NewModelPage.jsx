import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UploadArea } from '../components/UploadArea';
import { api } from '../services/api';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  tags: z.string().optional(),
  files: z.any(),
});

export const NewModelPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('tags', JSON.stringify(values.tags?.split(',').map((t) => t.trim()).filter(Boolean) || []));
    for (const file of values.files) formData.append('files', file);

    try {
      const { data } = await api.post('/models', formData);
      toast.success('Modelo criado com sucesso');
      navigate(`/modelos/${data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar modelo');
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Publicar novo modelo</h1>
        <input {...register('name')} placeholder="Nome único" className="w-full rounded bg-slate-800 p-2" />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        <textarea {...register('description')} rows={5} placeholder="Descrição" className="w-full rounded bg-slate-800 p-2" />
        <input {...register('tags')} placeholder="tags separadas por vírgula" className="w-full rounded bg-slate-800 p-2" />
        <UploadArea register={register} />
        <button className="w-full rounded bg-brand-600 p-2">Publicar</button>
      </form>
    </main>
  );
};
