// Vercel Serverless Function for Leads API
import type { VercelRequest, VercelResponse } from '@vercel/node';

let leads: any[] = [
  { id: '1', name: '이영희', company: '네이버', email: 'lee@example.com', phone: '010-3456-7890', status: 'new', source: 'website', createdAt: new Date().toISOString() },
  { id: '2', name: '박민수', company: '카카오', email: 'park@example.com', phone: '010-4567-8901', status: 'contacted', source: 'referral', createdAt: new Date().toISOString() },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req;

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const lead = leads.find(l => l.id === query.id);
          if (!lead) return res.status(404).json({ error: 'Lead not found' });
          return res.status(200).json({ data: lead });
        }
        return res.status(200).json({ data: leads, pagination: { total: leads.length, page: 1, limit: 10 } });

      case 'POST':
        const newLead = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
        leads.push(newLead);
        return res.status(201).json({ data: newLead });

      case 'PUT':
        const index = leads.findIndex(l => l.id === query.id);
        if (index === -1) return res.status(404).json({ error: 'Lead not found' });
        leads[index] = { ...leads[index], ...req.body };
        return res.status(200).json({ data: leads[index] });

      case 'DELETE':
        const deleteIndex = leads.findIndex(l => l.id === query.id);
        if (deleteIndex === -1) return res.status(404).json({ error: 'Lead not found' });
        leads.splice(deleteIndex, 1);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
