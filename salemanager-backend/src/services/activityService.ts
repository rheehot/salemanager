// Activity Service
import prisma from '../lib/db/prisma.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';

export interface ActivityCreate {
  type: string;
  title: string;
  customerId?: string;
  leadId?: string;
  opportunityId?: string;
  description?: string;
  activityDate: string;
  duration?: number;
  outcome?: string;
}

export interface ActivityUpdate extends Partial<ActivityCreate> {}

export class ActivityService {
  async findAll(
    params: PaginationParams & {
      type?: string;
      customerId?: string;
      leadId?: string;
      opportunityId?: string;
    }
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20, type, customerId, leadId, opportunityId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (customerId) where.customerId = customerId;
    if (leadId) where.leadId = leadId;
    if (opportunityId) where.opportunityId = opportunityId;

    const [data, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { activityDate: 'desc' },
        include: {
          customer: { select: { id: true, name: true } },
          lead: { select: { id: true, name: true } },
          opportunity: { select: { id: true, title: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
      include: {
        customer: true,
        lead: true,
        opportunity: true,
      },
    });
  }

  async create(data: ActivityCreate) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('활동 제목은 필수입니다');
    }
    if (!data.activityDate) {
      throw new Error('활동 일시는 필수입니다');
    }

    return prisma.activity.create({
      data: {
        type: data.type,
        title: data.title.trim(),
        customerId: data.customerId,
        leadId: data.leadId,
        opportunityId: data.opportunityId,
        description: data.description?.trim(),
        activityDate: new Date(data.activityDate),
        duration: data.duration,
        outcome: data.outcome?.trim(),
      },
      include: {
        customer: true,
        lead: true,
        opportunity: true,
      },
    });
  }

  async update(id: string, data: ActivityUpdate) {
    const updateData: any = {};
    if (data.type) updateData.type = data.type;
    if (data.title) updateData.title = data.title.trim();
    if (data.customerId !== undefined) updateData.customerId = data.customerId;
    if (data.leadId !== undefined) updateData.leadId = data.leadId;
    if (data.opportunityId !== undefined) updateData.opportunityId = data.opportunityId;
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.activityDate) updateData.activityDate = new Date(data.activityDate);
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.outcome !== undefined) updateData.outcome = data.outcome.trim();

    return prisma.activity.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        lead: true,
        opportunity: true,
      },
    });
  }

  async delete(id: string) {
    await prisma.activity.delete({
      where: { id },
    });
  }
}
