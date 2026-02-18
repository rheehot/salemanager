// Leads Page
import { useEffect, useState } from 'react';
import { leadService } from '@/services/api';
import { Lead, LeadCreate } from '@/types';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadCreate>({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'other',
    status: 'new',
  });

  const { showNotification, setIsLoading } = useApp();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAll();
      setLeads(response.data);
    } catch (error) {
      showNotification('리드 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingLead) {
        await leadService.update(editingLead.id, formData);
        showNotification('리드가 수정되었습니다.');
      } else {
        await leadService.create(formData);
        showNotification('리드가 추가되었습니다.');
      }
      setModalOpen(false);
      loadLeads();
      resetForm();
    } catch (error) {
      showNotification('저장에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async (id: string, name: string) => {
    if (!confirm(`${name} 님을 고객으로 전환하시겠습니까?`)) return;
    try {
      setIsLoading(true);
      await leadService.convertToCustomer(id);
      showNotification('고객으로 전환되었습니다.');
      loadLeads();
    } catch (error) {
      showNotification('전환에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company || '',
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source,
      status: lead.status,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      setIsLoading(true);
      await leadService.delete(id);
      showNotification('리드가 삭제되었습니다.');
      loadLeads();
    } catch (error) {
      showNotification('삭제에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingLead(null);
    setFormData({ name: '', company: '', email: '', phone: '', source: 'other', status: 'new' });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: '신규',
      contacted: '연락 완료',
      qualified: '검증 완료',
      converted: '전환 완료',
      lost: '상실',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리드 관리</h1>
          <p className="text-gray-600 mt-1">총 {leads.length}명의 리드</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          리드 추가
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  회사
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  소스
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    리드가 없습니다.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleConvert(lead.id, lead.name)}
                        className="text-green-600 hover:text-green-900 mr-2"
                        title="고객으로 전환"
                      >
                        <UserCheck className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleEdit(lead)}
                        className="text-primary-600 hover:text-primary-900 mr-2"
                      >
                        <Pencil className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingLead ? '리드 수정' : '리드 추가'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">회사</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소스</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="input"
            >
              <option value="website">웹사이트</option>
              <option value="referral">추천</option>
              <option value="event">이벤트</option>
              <option value="cold_call">콜드콜</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input"
            >
              <option value="new">신규</option>
              <option value="contacted">연락 완료</option>
              <option value="qualified">검증 완료</option>
              <option value="lost">상실</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              취소
            </Button>
            <Button type="submit">{editingLead ? '수정' : '추가'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
