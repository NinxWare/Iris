import { Link } from 'react-router-dom';

export const ModelCard = ({ model }) => (
  <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
    <h3 className="text-lg font-semibold">{model.name}</h3>
    <p className="mt-2 text-sm text-slate-300 line-clamp-3">{model.description}</p>
    <div className="mt-3 flex flex-wrap gap-2">
      {model.tags.map((tag) => (
        <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-brand-500">#{tag}</span>
      ))}
    </div>
    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
      <span>Downloads: {model.downloads}</span>
      <Link className="text-brand-500" to={`/modelos/${model.id}`}>Detalhes</Link>
    </div>
  </article>
);
