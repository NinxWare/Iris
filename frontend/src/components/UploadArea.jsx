export const UploadArea = ({ register }) => (
  <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 p-8 text-sm text-slate-400">
    Arraste arquivos ou clique para selecionar
    <input type="file" multiple className="hidden" {...register('files')} />
  </label>
);
