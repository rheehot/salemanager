// Customer Service
import prisma from '../lib/db/prisma.js';
import { PaginationParams, PaginatedResponse } from '../types/index.js';

export interface CustomerCreate {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface CustomerUpdate extends Partial<CustomerCreate> {}

export class CustomerService {
  async findAll(params: PaginationParams): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20, search, status } = params;
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

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
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
    return prisma.customer.findUnique({
      where: { id },
      include: {
        opportunities: true,
        activities: true,
      },
    });
  }

  async create(data: CustomerCreate) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('고객명은 필수입니다');
    }
    return prisma.customer.create({
      data: {
        name: data.name.trim(),
        company: data.company?.trim(),
        email: data.email?.trim(),
        phone: data.phone?.trim(),
        status: data.status || 'active',
      },
    });
  }

  async update(id: string, data: CustomerUpdate) {
    return prisma.customer.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.company !== undefined && { company: data.company.trim() || null }),
        ...(data.email !== undefined && { email: data.email.trim() || null }),
        ...(data.phone !== undefined && { phone: data.phone.trim() || null }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  async delete(id: string) {
    await prisma.customer.delete({
      where: { id },
    });
  }
}
