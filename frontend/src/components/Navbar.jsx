import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-semibold text-brand-500">AI Model Hub</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-brand-500">Modelos</Link>
          <Link to="/testar-ia" className="hover:text-brand-500">Testar IA</Link>
          {user ? (
            <>
              <Link to="/perfil" className="hover:text-brand-500">Perfil</Link>
              <button className="rounded bg-slate-800 px-3 py-1" onClick={logout}>Sair</button>
            </>
          ) : (
            <Link to="/auth" className="rounded bg-brand-600 px-3 py-1">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
};
