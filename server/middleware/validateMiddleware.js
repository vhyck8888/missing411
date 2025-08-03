export const validateCaseData = (req, res, next) => {
  const { name, status, date, lastSeen, latitude, longitude } = req.body;
  if (!name || !status || !date || !lastSeen || !latitude || !longitude) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  next();
};
