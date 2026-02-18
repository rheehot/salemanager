// Vercel Serverless Function for Customers API
import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for demo (replace with real database)
let customers: any[] = [
  { id: '1', name: '홍길동', company: '삼성전자', email: 'hong@example.com', phone: '010-1234-5678', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: '김철수', company: 'LG전자', email: 'kim@example.com', phone: '010-2345-6789', status: 'lead', createdAt: new Date().toISOString() },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query } = req;

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const customer = customers.find(c => c.id === query.id);
          if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
          }
          return res.status(200).json({ data: customer });
        }
        return res.status(200).json({
          data: customers,
          pagination: { total: customers.length, page: 1, limit: 10 }
        });

      case 'POST':
        const newCustomer = {
          id: Date.now().toString(),
          ...req.body,
          createdAt: new Date().toISOString()
        };
        customers.push(newCustomer);
        return res.status(201).json({ data: newCustomer });

      case 'PUT':
        const { id } = query;
        const index = customers.findIndex(c => c.id === id);
        if (index === -1) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        customers[index] = { ...customers[index], ...req.body };
        return res.status(200).json({ data: customers[index] });

      case 'DELETE':
        const deleteIndex = customers.findIndex(c => c.id === query.id);
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        customers.splice(deleteIndex, 1);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Customers API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
