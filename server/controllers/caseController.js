import Case from '../models/Case.js';

export const getCases = async (req, res) => {
  try {
    const cases = await Case.find();
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cases' });
  }
};

export const addCase = async (req, res) => {
  try {
    const { name, status, date, lastSeen, latitude, longitude, description } = req.body;
    const photoUrl = req.file ? req.file.filename : null;

    if (!name || !status || !date || !lastSeen || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newCase = new Case({
      name,
      status,
      date,
      lastSeen,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description: description || '',
      photoUrl,
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ message: 'Error creating case', error: error.message });
  }
};

export const updateCaseStatus = async (req, res) => {
  const caseId = req.params.id;
  const { status } = req.body;

  try {
    const foundCase = await Case.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    foundCase.status = status;
    await foundCase.save();

    res.json(foundCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update case status' });
  }
};
