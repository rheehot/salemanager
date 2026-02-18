// Vercel Serverless Function for Activities API
import type { VercelRequest, VercelResponse } from '@vercel/node';

let activities: any[] = [
  { id: '1', type: 'call', title: '삼성전자 담당자 통화', description: 'ERP 구축 프로젝트 논의', activityDate: '2026-02-18T10:00:00', duration: 30, outcome: '긍정적 반응', customerId: '1', createdAt: new Date().toISOString() },
  { id: '2', type: 'email', title: 'LG전자 제안서 발송', description: 'CMS 도입 관련 제안서', activityDate: '2026-02-17T14:00:00', duration: null, outcome: '', customerId: '2', createdAt: new Date().toISOString() },
  { id: '3', type: 'meeting', title: '네이버 미팅', description: '클라우드 migration 요구사항 분석', activityDate: '2026-02-16T11:00:00', duration: 60, outcome: '다음 단계 진행 합의', customerId: '1', opportunityId: '3', createdAt: new Date().toISOString() },
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
          const activity = activities.find(a => a.id === query.id);
          if (!activity) return res.status(404).json({ error: 'Activity not found' });
          return res.status(200).json({ data: activity });
        }
        return res.status(200).json({ data: activities, pagination: { total: activities.length, page: 1, limit: 10 } });

      case 'POST':
        const newActivity = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
        activities.push(newActivity);
        return res.status(201).json({ data: newActivity });

      case 'PUT':
        const index = activities.findIndex(a => a.id === query.id);
        if (index === -1) return res.status(404).json({ error: 'Activity not found' });
        activities[index] = { ...activities[index], ...req.body };
        return res.status(200).json({ data: activities[index] });

      case 'DELETE':
        const deleteIndex = activities.findIndex(a => a.id === query.id);
        if (deleteIndex === -1) return res.status(404).json({ error: 'Activity not found' });
        activities.splice(deleteIndex, 1);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
