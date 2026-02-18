// Email Campaign Page
import { useEffect, useState } from 'react';
import { Mail, Send, Users, FileText } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: string;
  createdAt: string;
  customer?: {
    name: string;
    email: string;
  };
}

export default function EmailCampaign() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  const [emailForm, setEmailForm] = useState({
    to: [] as string[],
    subject: '',
    body: '',
    template: '',
    templateData: {} as Record<string, string>
  });

  const { showNotification, setIsLoading } = useApp();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [customersRes, templatesRes, logsRes] = await Promise.all([
        fetch('http://localhost:3000/api/customers?limit=100'),
        fetch('http://localhost:3000/api/emails/templates'),
        fetch('http://localhost:3000/api/emails/logs?limit=20')
      ]);

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.data.filter((c: Customer) => c.email));
      }

      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.data);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.data);
      }
    } catch (error) {
      showNotification('데이터를 불러오는데 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/emails/templates/${templateId}`);
      if (res.ok) {
        const data = await res.json();
        const template: EmailTemplate = data.data;

        setEmailForm({
          ...emailForm,
          template: templateId,
          subject: template.subject,
          body: template.body,
          templateData: {}
        });

        // 템플릿 변수 초기화
        const initialData: Record<string, string> = {};
        template.variables.forEach(v => {
          if (v === 'customerName') {
            initialData[v] = '{{customerName}}';
          } else {
            initialData[v] = '';
          }
        });
        setEmailForm(prev => ({ ...prev, templateData: initialData }));
      }
    } catch (error) {
      showNotification('템플릿을 불러오는데 실패했습니다.', 'error');
    }
  };

  const handleSend = async () => {
    const customerIds = Array.from(selectedCustomers);

    if (customerIds.length === 0) {
      showNotification('고객을 선택해주세요.', 'error');
      return;
    }

    if (!emailForm.subject) {
      showNotification('제목을 입력해주세요.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3000/api/emails/send-many', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerIds,
          subject: emailForm.subject,
          body: emailForm.body,
          template: emailForm.template || undefined,
          templateData: emailForm.templateData
        })
      });

      if (res.ok) {
        const data = await res.json();
        showNotification(`이메일 ${data.sent}건 발송 성공! (실패: ${data.failed}건)`);
        setModalOpen(false);
        setSelectedCustomers(new Set());
        setEmailForm({
          to: [],
          subject: '',
          body: '',
          template: '',
          templateData: {}
        });
        loadData();
      } else {
        throw new Error('발송 실패');
      }
    } catch (error) {
      showNotification('이메일 발송에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCustomer = (customerId: string) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const selectAll = () => {
    if (selectedCustomers.size === customers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(customers.map(c => c.id)));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">발송 완료</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">발송 실패</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">발송 중</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">이메일 캠페인</h1>
          <p className="text-gray-600 mt-1">고객에게 이메일을 발송하세요</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          이메일 발송
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">전체 고객</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}명</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <Mail className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">이메일 템플릿</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}개</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">총 발송</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}건</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Logs */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">최근 발송 내역</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">수신자</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">발송 시간</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    발송 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{log.to}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.subject}</td>
                    <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString('ko-KR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Email Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="이메일 발송"
      >
        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">템플릿 선택</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEmailForm({ ...emailForm, template: '', subject: '', body: '' })}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  !emailForm.template ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium">직접 입력</div>
              </button>
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    emailForm.template === template.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{template.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">수신자 선택</label>
              <button
                type="button"
                onClick={selectAll}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {selectedCustomers.size === customers.length ? '모두 해제' : '모두 선택'} ({selectedCustomers.size}/{customers.length})
              </button>
            </div>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {customers.map((customer) => (
                <label
                  key={customer.id}
                  className={`flex items-center p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    selectedCustomers.has(customer.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCustomers.has(customer.id)}
                    onChange={() => toggleCustomer(customer.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.email}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="input"
              placeholder="이메일 제목"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              rows={8}
              value={emailForm.body}
              onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
              className="input font-mono text-sm"
              placeholder="이메일 내용 (줄바꿈은 자동으로 <br>로 변환됩니다)"
            />
          </div>

          {/* Template Variables */}
          {emailForm.template && Object.keys(emailForm.templateData).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">템플릿 변수</label>
              <div className="space-y-2">
                {Object.entries(emailForm.templateData)
                  .filter(([key]) => key !== 'customerName')
                  .map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-600 mb-1">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setEmailForm({
                          ...emailForm,
                          templateData: { ...emailForm.templateData, [key]: e.target.value }
                        })}
                        className="input text-sm"
                        placeholder={`{{${key}}}`}
                      />
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">* {'{{customerName}}'}은 자동으로 고객명으로 변환됩니다</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleSend} disabled={selectedCustomers.size === 0}>
              <Send className="w-4 h-4 mr-2" />
              {selectedCustomers.size}명에게 발송
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
