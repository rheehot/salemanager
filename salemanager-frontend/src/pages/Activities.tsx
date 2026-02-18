// Activities Page
import { useEffect, useState } from 'react';
import { activityService, customerService, leadService } from '@/services/api';
import { Activity, ActivityCreate, Customer, Lead } from '@/types';
import { Plus, Mail, Phone, Users, Calendar, FileText, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<ActivityCreate>({
    type: 'email',
    title: '',
    description: '',
    activityDate: new Date().toISOString().slice(0, 16),
    duration: null,
    outcome: '',
    customerId: null,
    leadId: null,
    opportunityId: null,
  });

  const { showNotification, setIsLoading } = useApp();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, customersRes, leadsRes] = await Promise.all([
        activityService.getAll({ limit: 50 }),
        customerService.getAll({ limit: 100 }),
        leadService.getAll(),
      ]);
      setActivities(activitiesRes.data);
      setCustomers(customersRes.data);
      setLeads(leadsRes.data);
    } catch (error) {
      showNotification('데이터를 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activityService.getAll({ limit: 50 });
      setActivities(response.data);
    } catch (error) {
      showNotification('활동 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingActivity) {
        await activityService.update(editingActivity.id, formData);
        showNotification('활동이 수정되었습니다.');
      } else {
        await activityService.create(formData);
        showNotification('활동이 추가되었습니다.');
      }
      setModalOpen(false);
      loadActivities();
      resetForm();
    } catch (error) {
      showNotification('저장에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      type: activity.type,
      title: activity.title,
      description: activity.description || '',
      activityDate: new Date(activity.activityDate).toISOString().slice(0, 16),
      duration: activity.duration || null,
      outcome: activity.outcome || '',
      customerId: activity.customerId || null,
      leadId: activity.leadId || null,
      opportunityId: activity.opportunityId || null,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      setIsLoading(true);
      await activityService.delete(id);
      showNotification('활동이 삭제되었습니다.');
      loadActivities();
    } catch (error) {
      showNotification('삭제에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingActivity(null);
    setFormData({
      type: 'email',
      title: '',
      description: '',
      activityDate: new Date().toISOString().slice(0, 16),
      duration: null,
      outcome: '',
      customerId: null,
      leadId: null,
      opportunityId: null,
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-5 h-5 text-blue-600" />;
      case 'call':
        return <Phone className="w-5 h-5 text-green-600" />;
      case 'meeting':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'note':
        return <FileText className="w-5 h-5 text-gray-600" />;
      default:
        return <Calendar className="w-5 h-5 text-orange-600" />;
    }
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: '이메일',
      call: '통화',
      meeting: '미팅',
      note: '메모',
      other: '기타',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">활동 로그</h1>
          <p className="text-gray-600 mt-1">최근 활동 내역</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          활동 추가
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : activities.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            활동 내역이 없습니다.
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{formatDate(activity.activityDate)}</span>
                      <button
                        onClick={() => handleEdit(activity)}
                        className="text-primary-600 hover:text-primary-900 p-1"
                        title="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="px-2 py-1 bg-gray-100 rounded">{getActivityLabel(activity.type)}</span>
                    {activity.duration && <span>소요 시간: {activity.duration}분</span>}
                  </div>
                  {activity.description && (
                    <p className="text-gray-600 mb-2">{activity.description}</p>
                  )}
                  {activity.outcome && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-3 mt-2">
                      <p className="text-sm text-green-800">{activity.outcome}</p>
                    </div>
                  )}
                  {(activity.customer || activity.lead || activity.opportunity) && (
                    <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                      {activity.customer && (
                        <span>고객: {activity.customer.name}</span>
                      )}
                      {activity.lead && <span>리드: {activity.lead.name}</span>}
                      {activity.opportunity && <span>기회: {activity.opportunity.title}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingActivity ? '활동 수정' : '활동 추가'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">활동 유형</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="input"
            >
              <option value="email">이메일</option>
              <option value="call">통화</option>
              <option value="meeting">미팅</option>
              <option value="note">메모</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="활동 제목"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">활동 일시</label>
            <input
              type="datetime-local"
              value={formData.activityDate}
              onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">관련 고객 (선택)</label>
            <select
              value={formData.customerId || ''}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value || null, leadId: null })}
              className="input"
            >
              <option value="">선택 안함</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.company && `(${customer.company})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">관련 리드 (선택)</label>
            <select
              value={formData.leadId || ''}
              onChange={(e) => setFormData({ ...formData, leadId: e.target.value || null, customerId: null })}
              className="input"
              disabled={!!formData.customerId}
            >
              <option value="">선택 안함</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} {lead.company && `(${lead.company})`}
                </option>
              ))}
            </select>
            {formData.customerId && (
              <p className="text-xs text-gray-500 mt-1">고객을 선택하면 리드를 선택할 수 없습니다.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소요 시간 (분)</label>
            <input
              type="number"
              min="0"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || null })}
              className="input"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="활동 내용"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">결과 메모</label>
            <textarea
              rows={2}
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              className="input"
              placeholder="활동 결과"
            />
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
            <Button type="submit">{editingActivity ? '수정' : '저장'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
