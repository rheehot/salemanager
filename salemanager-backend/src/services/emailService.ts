// Email Service
import nodemailer from 'nodemailer';
import prisma from '../lib/db/prisma.js';

export interface EmailSendDto {
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  template?: string;
  templateData?: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

// 이메일 템플릿 저장소
const emailTemplates: EmailTemplate[] = [
  {
    id: 'greeting',
    name: '환영 인사',
    subject: '{{customerName}}님, SaleManager에 오신 것을 환영합니다!',
    body: `안녕하세요 {{customerName}}님,

SaleManager를 이용해 주셔서 감사합니다.

저희 서비스를 통해 귀사의 영업 활동을 더욱 효율적으로 관리하실 수 있습니다.

혹시 도움이 필요하시면 언제든지 연락해 주세요.

감사합니다.
SaleManager 팀`,
    variables: ['customerName']
  },
  {
    id: 'promotion',
    name: '프로모션 안내',
    subject: '{{productName}} 특별 프로모션 안내',
    body: `안녕하세요 {{customerName}}님,

{{productName}}에 대한 특별 프로모션을 안내해 드립니다!

🎉 프로모션 혜택:
{{promotionDetails}}

이 기회를 놓치지 마세요!

감사합니다.
SaleManager 팀`,
    variables: ['customerName', 'productName', 'promotionDetails']
  },
  {
    id: 'follow_up',
    name: '후속 조치',
    subject: '후속 조치 안내 - {{subject}}',
    body: `안녕하세요 {{customerName}}님,

이전에 문의하셨던 사항에 대한 후속 조치 안내를 드립니다.

{{message}}

궁금한 사항이 있으시면 언제든지 연락해 주세요.

감사합니다.
{{senderName}}`,
    variables: ['customerName', 'subject', 'message', 'senderName']
  },
  {
    id: 'newsletter',
    name: '뉴스레터',
    subject: 'SaleManager 뉴스레터 - {{month}}월호',
    body: `안녕하세요 {{customerName}}님,

{{month}}월 SaleManager 뉴스레터를 보내드립니다.

{{content}}

더 나은 서비스를 제공하기 위해 항상 노력하겠습니다.

감사합니다.
SaleManager 팀`,
    variables: ['customerName', 'month', 'content']
  }
];

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      }
    };

    // 이메일 설정이 없으면 콘솔에만 출력 (개발용)
    if (!emailConfig.auth.user) {
      console.log('⚠️ 이메일 설정이 없습니다. 콘솔에만 출력됩니다.');
      return;
    }

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendEmail(dto: EmailSendDto) {
    // 템플릿 적용
    let subject = dto.subject;
    let body = dto.body;

    if (dto.template && dto.templateData) {
      const template = emailTemplates.find(t => t.id === dto.template);
      if (template) {
        subject = this.renderTemplate(template.subject, dto.templateData);
        body = this.renderTemplate(template.body, dto.templateData);
      }
    }

    // 발송 기록 저장
    const emailLog = await prisma.emailLog.create({
      data: {
        to: dto.to.join(','),
        cc: dto.cc?.join(',') || null,
        subject,
        body,
        status: 'sending'
      }
    });

    // 이메일 발송
    try {
      if (this.transporter) {
        const info = await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || `"SaleManager" <${process.env.EMAIL_USER}>`,
          to: dto.to.join(', '),
          cc: dto.cc,
          subject,
          html: body.replace(/\n/g, '<br>')
        });

        console.log('✅ 이메일 발송 성공:', info.messageId);

        // 발송 성공 업데이트
        await prisma.emailLog.update({
          where: { id: emailLog.id },
          data: { status: 'sent', messageId: info.messageId }
        });

        return { success: true, messageId: info.messageId };
      } else {
        // 개발용: 콘솔에만 출력
        console.log('📧 [이메일 발송 시뮬레이션]');
        console.log(`수신: ${dto.to.join(', ')}`);
        console.log(`제목: ${subject}`);
        console.log(`내용:\n${body}`);

        // 발송 성공으로 처리
        await prisma.emailLog.update({
          where: { id: emailLog.id },
          data: { status: 'sent', messageId: 'simulated-' + Date.now() }
        });

        return { success: true, messageId: 'simulated' };
      }
    } catch (error) {
      console.error('❌ 이메일 발송 실패:', error);

      // 발송 실패 업데이트
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: { status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }
      });

      throw error;
    }
  }

  async sendToMany(customers: Array<{ id: string; name: string; email: string }>, dto: Omit<EmailSendDto, 'to'>) {
    const results = [];

    for (const customer of customers) {
      if (!customer.email) continue;

      try {
        const result = await this.sendEmail({
          ...dto,
          to: [customer.email],
          templateData: {
            ...dto.templateData,
            customerName: customer.name
          }
        });
        results.push({ email: customer.email, success: true, result });
      } catch (error) {
        results.push({ email: customer.email, success: false, error });
      }
    }

    return results;
  }

  private renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  getTemplates(): EmailTemplate[] {
    return emailTemplates;
  }

  getTemplate(id: string): EmailTemplate | undefined {
    return emailTemplates.find(t => t.id === id);
  }

  async getEmailLogs(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, email: true } }
        }
      }),
      prisma.emailLog.count()
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
