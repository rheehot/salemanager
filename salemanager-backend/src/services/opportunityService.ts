// Opportunity Service
import prisma from '../lib/db/prisma.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';

export interface OpportunityCreate {
  title: string;
  customerId?: string;
  leadId?: string;
  stage?: string;
  value?: number;
  probability?: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  notes?: string;
}

export interface OpportunityUpdate extends Partial<OpportunityCreate> {}

export class OpportunityService {
  async findAll(params: PaginationParams & { stage?: string }): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20, stage } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (stage) {
      where.stage = stage;
    }

    const [data, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, company: true } },
          lead: { select: { id: true, name: true, company: true } },
        },
      }),
      prisma.opportunity.count({ where }),
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
    return prisma.opportunity.findUnique({
      where: { id },
      include: {
        customer: true,
        lead: true,
        activities: true,
      },
    });
  }

  async create(data: OpportunityCreate) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('기회명은 필수입니다');
    }
    if (!data.customerId && !data.leadId) {
      throw new Error('고객 또는 리드를 지정해야 합니다');
    }
    if (!data.expectedCloseDate) {
      throw new Error('예상 계약일은 필수입니다');
    }

    return prisma.opportunity.create({
      data: {
        title: data.title.trim(),
        customerId: data.customerId,
        leadId: data.leadId,
        stage: data.stage || 'prospecting',
        value: data.value || 0,
        probability: data.probability || 10,
        expectedCloseDate: new Date(data.expectedCloseDate),
        actualCloseDate: data.actualCloseDate ? new Date(data.actualCloseDate) : null,
        notes: data.notes?.trim(),
      },
      include: {
        customer: true,
        lead: true,
      },
    });
  }

  async update(id: string, data: OpportunityUpdate) {
    const updateData: any = {};
    if (data.title) updateData.title = data.title.trim();
    if (data.customerId !== undefined) updateData.customerId = data.customerId;
    if (data.leadId !== undefined) updateData.leadId = data.leadId;
    if (data.stage) updateData.stage = data.stage;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.probability !== undefined) updateData.probability = data.probability;
    if (data.expectedCloseDate) updateData.expectedCloseDate = new Date(data.expectedCloseDate);
    if (data.actualCloseDate !== undefined) {
      updateData.actualCloseDate = data.actualCloseDate ? new Date(data.actualCloseDate) : null;
    }
    if (data.notes !== undefined) updateData.notes = data.notes.trim();

    return prisma.opportunity.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        lead: true,
      },
    });
  }

  async delete(id: string) {
    await prisma.opportunity.delete({
      where: { id },
    });
  }
}
