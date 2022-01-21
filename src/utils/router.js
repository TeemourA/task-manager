export const handleError = (error, req, res, next) => {
  res.status(400).send({ error: error.message });
};
