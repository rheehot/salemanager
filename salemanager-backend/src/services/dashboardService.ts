// Dashboard Service
import prisma from '../lib/db/prisma.js';

export interface DashboardStats {
  customers: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  };
  opportunities: {
    total: number;
    byStage: Record<string, number>;
    totalValue: number;
    weightedValue: number;
  };
  activities: {
    total: number;
    thisWeek: number;
    byType: Record<string, number>;
  };
}

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      leadsByStatus,
      opportunitiesByStage,
      allOpportunities,
      totalActivities,
      activitiesThisWeek,
      activitiesByType,
    ] = await Promise.all([
      // Customer stats
      prisma.customer.count(),
      prisma.customer.count({ where: { status: 'active' } }),
      prisma.customer.count({
        where: { createdAt: { gte: startOfMonth } },
      }),

      // Lead stats
      prisma.lead.groupBy({
        by: ['status'],
        _count: true,
      }),

      // Opportunity stats
      prisma.opportunity.groupBy({
        by: ['stage'],
        _count: true,
        _sum: { value: true },
      }),

      prisma.opportunity.findMany({
        where: { stage: { notIn: ['closed_won', 'closed_lost'] } },
      }),

      // Activity stats
      prisma.activity.count(),
      prisma.activity.count({
        where: { activityDate: { gte: startOfWeek } },
      }),
      prisma.activity.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    // Process lead stats
    const leadStats = {
      total: leadsByStatus.reduce((sum, stat) => sum + stat._count, 0),
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };
    leadsByStatus.forEach((stat) => {
      if (stat.status in leadStats) {
        (leadStats as any)[stat.status] = stat._count;
      }
    });

    // Process opportunity stats
    const opportunityByStage: Record<string, number> = {};
    let totalValue = 0;
    let weightedValue = 0;

    opportunitiesByStage.forEach((stat) => {
      opportunityByStage[stat.stage] = stat._count;
    });

    allOpportunities.forEach((opp) => {
      totalValue += opp.value;
      weightedValue += (opp.value * opp.probability) / 100;
    });

    // Process activity stats
    const activityByType: Record<string, number> = {};
    activitiesByType.forEach((stat) => {
      activityByType[stat.type] = stat._count;
    });

    return {
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        newThisMonth: newCustomersThisMonth,
      },
      leads: leadStats,
      opportunities: {
        total: opportunitiesByStage.reduce((sum, stat) => sum + stat._count, 0),
        byStage: opportunityByStage,
        totalValue,
        weightedValue,
      },
      activities: {
        total: totalActivities,
        thisWeek: activitiesThisWeek,
        byType: activityByType,
      },
    };
  }
}
