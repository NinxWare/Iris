export const errorHandler = (err, req, res, next) => {
  req.log?.error(err);
  if (err?.name === 'ZodError') {
    return res.status(400).json({ message: 'Dados inválidos', errors: err.errors });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
};
