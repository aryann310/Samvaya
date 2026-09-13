import type { Request, Response } from 'express';
import { HyperlocalEngine } from '../hyperlocal/index.js';

export const getHyperlocal = async (req: Request, res: Response) => {
  try {
    // Ideally we fetch location from the business profile in DB.
    // Here we use a default location for demo purposes if not passed.
    const location = {
      country: 'India',
      state: 'Gujarat',
      district: 'Mehsana',
      city: 'Modhera'
    };
    const snapshot = await HyperlocalEngine.getHyperlocalSnapshot(location);
    res.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error fetching hyperlocal data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch hyperlocal intelligence' });
  }
};
