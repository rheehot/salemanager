// Vercel Serverless Function for Pipeline/Opportunities API

let opportunities = [
  { id: '1', title: '삼성전자 ERP 구축', customerId: '1', stage: 'proposal', value: 50000000, probability: 60, expectedCloseDate: '2026-03-15', notes: '제안서 제출 완료', createdAt: new Date().toISOString() },
  { id: '2', title: 'LG전자 CMS 도입', customerId: '2', stage: 'negotiation', value: 30000000, probability: 80, expectedCloseDate: '2026-02-28', notes: '가격 협의 중', createdAt: new Date().toISOString() },
  { id: '3', title: '네이버 클라우드 migration', customerId: '1', stage: 'discovery', value: 80000000, probability: 30, expectedCloseDate: '2026-04-30', notes: '요구사항 분석 중', createdAt: new Date().toISOString() },
];

export default async function handler(req, res) {
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
          const opp = opportunities.find(o => o.id === query.id);
          if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
          return res.status(200).json({ data: opp });
        }
        return res.status(200).json({ data: opportunities, pagination: { total: opportunities.length, page: 1, limit: 10 } });

      case 'POST':
        const newOpp = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
        opportunities.push(newOpp);
        return res.status(201).json({ data: newOpp });

      case 'PUT':
        const index = opportunities.findIndex(o => o.id === query.id);
        if (index === -1) return res.status(404).json({ error: 'Opportunity not found' });
        opportunities[index] = { ...opportunities[index], ...req.body };
        return res.status(200).json({ data: opportunities[index] });

      case 'DELETE':
        const deleteIndex = opportunities.findIndex(o => o.id === query.id);
        if (deleteIndex === -1) return res.status(404).json({ error: 'Opportunity not found' });
        opportunities.splice(deleteIndex, 1);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
