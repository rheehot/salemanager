// Lead Service
import prisma from '../lib/db/prisma.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';

export interface LeadCreate {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
}

export interface LeadUpdate extends Partial<LeadCreate> {}

export class LeadService {
  async findAll(params: PaginationParams & { source?: string }): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20, search, status, source } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (source) {
      where.source = source;
    }

    const [data, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
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
    return prisma.lead.findUnique({
      where: { id },
      include: {
        opportunities: true,
        activities: true,
      },
    });
  }

  async create(data: LeadCreate) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('리드명은 필수입니다');
    }
    return prisma.lead.create({
      data: {
        name: data.name.trim(),
        company: data.company?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        source: data.source || 'other',
        status: data.status || 'new',
      },
    });
  }

  async update(id: string, data: LeadUpdate) {
    return prisma.lead.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.company !== undefined && { company: data.company.trim() || null }),
        ...(data.email !== undefined && { email: data.email.trim() || null }),
        ...(data.phone !== undefined && { phone: data.phone.trim() || null }),
        ...(data.source && { source: data.source }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  async delete(id: string) {
    await prisma.lead.delete({
      where: { id },
    });
  }

  async convertToCustomer(leadId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        opportunities: true,
        activities: true,
      },
    });

    if (!lead) {
      throw new Error('리드를 찾을 수 없습니다');
    }

    // Create customer from lead
    const customer = await prisma.customer.create({
      data: {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: 'active',
      },
    });

    // Update opportunities to link to customer
    if (lead.opportunities.length > 0) {
      await Promise.all(
        lead.opportunities.map((opp) =>
          prisma.opportunity.update({
            where: { id: opp.id },
            data: { customerId: customer.id, leadId: null },
          })
        )
      );
    }

    // Update activities to link to customer
    if (lead.activities.length > 0) {
      await Promise.all(
        lead.activities.map((activity) =>
          prisma.activity.update({
            where: { id: activity.id },
            data: { customerId: customer.id, leadId: null },
          })
        )
      );
    }

    // Delete the lead
    await prisma.lead.delete({
      where: { id: leadId },
    });

    return {
      customerId: customer.id,
      leadId,
      message: '리드가 고객으로 전환되었습니다',
    };
  }
}
