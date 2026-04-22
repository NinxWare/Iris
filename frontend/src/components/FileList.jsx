export const FileList = ({ files, onDelete }) => (
  <ul className="space-y-2">
    {files.map((file) => (
      <li key={file.id} className="flex items-center justify-between rounded bg-slate-900 p-2 text-sm">
        <span>{file.original} ({Math.round(file.size / 1024)} KB)</span>
        {onDelete && <button onClick={() => onDelete(file.id)} className="text-red-400">Remover</button>}
      </li>
    ))}
  </ul>
);
