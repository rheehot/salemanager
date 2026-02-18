// Vercel Serverless Function for Dashboard API
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const stats = {
      totalCustomers: 12,
      activeCustomers: 8,
      totalLeads: 25,
      newLeads: 5,
      totalOpportunities: 18,
      totalValue: 450000000,
      wonThisMonth: 3,
      conversionRate: 35,
      recentActivities: 15,
    };

    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
