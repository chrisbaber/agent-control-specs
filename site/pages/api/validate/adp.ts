import type { NextApiRequest, NextApiResponse } from 'next';
import { validateAdp } from '../../../lib/validators/adp';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const result = validateAdp(req.body);
  if (result.valid) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
}
