import type { NextApiRequest, NextApiResponse } from 'next';
import { validateCtx } from '../../../lib/validators/ctx';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let input = req.body;
  // If json { "capability": "..." }
  if (typeof req.body === 'object' && req.body.capability) {
      input = req.body.capability;
  }
  
  if (typeof input !== 'string') {
      return res.status(400).json({ valid: false, message: 'Invalid Input: Expected string or { capability: string }' });
  }

  const result = validateCtx(input);
  if (result.valid) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
}
