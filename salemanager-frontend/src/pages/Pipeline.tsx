// Pipeline Page
import { useEffect, useState } from 'react';
import { opportunityService } from '@/services/api';
import { Opportunity, OpportunityCreate } from '@/types';
import { Plus, DollarSign, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

const STAGES = [
  { key: 'prospecting', label: '발굴', color: 'bg-gray-100' },
  { key: 'qualification', label: '검토', color: 'bg-blue-100' },
  { key: 'proposal', label: '제안', color: 'bg-yellow-100' },
  { key: 'negotiation', label: '협상', color: 'bg-orange-100' },
  { key: 'closed_won', label: '계약 성공', color: 'bg-green-100' },
  { key: 'closed_lost', label: '계약 실패', color: 'bg-red-100' },
] as const;

export default function Pipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState<OpportunityCreate>({
    title: '',
    stage: 'prospecting',
    value: 0,
    probability: 10,
    expectedCloseDate: '',
    notes: '',
  });

  const { showNotification, setIsLoading } = useApp();

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      const response = await opportunityService.getAll();
      setOpportunities(response.data);
    } catch (error) {
      showNotification('영업 기회를 불러오는데 실패했습니다.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingOpportunity) {
        await opportunityService.update(editingOpportunity.id, formData);
        showNotification('영업 기회가 수정되었습니다.');
      } else {
        await opportunityService.create(formData);
        showNotification('영업 기회가 추가되었습니다.');
      }
      setModalOpen(false);
      loadOpportunities();
      resetForm();
    } catch (error) {
      showNotification('저장에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (opp: Opportunity) => {
    setEditingOpportunity(opp);
    setFormData({
      title: opp.title,
      stage: opp.stage,
      value: opp.value,
      probability: opp.probability,
      expectedCloseDate: opp.expectedCloseDate.split('T')[0],
      notes: opp.notes || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      setIsLoading(true);
      await opportunityService.delete(id);
      showNotification('영업 기회가 삭제되었습니다.');
      loadOpportunities();
    } catch (error) {
      showNotification('삭제에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEditingOpportunity(null);
    setFormData({
      title: '',
      stage: 'prospecting',
      value: 0,
      probability: 10,
      expectedCloseDate: '',
      notes: '',
    });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">영업 파이프라인</h1>
          <p className="text-gray-600 mt-1">총 {opportunities.length}개의 영업 기회</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          기회 추가
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageOpportunities = opportunities.filter((opp) => opp.stage === stage.key);
          return (
            <div key={stage.key} className="flex-shrink-0 w-80">
              <div className={`${stage.color} rounded-t-lg px-4 py-3`}>
                <h3 className="font-semibold text-gray-800">{stage.label}</h3>
                <p className="text-sm text-gray-600">{stageOpportunities.length}개</p>
              </div>
              <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-sm p-3 space-y-3 min-h-[400px]">
                {stageOpportunities.map((opp) => (
                  <div key={opp.id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex-1">{opp.title}</h4>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => handleEdit(opp)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="수정"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(opp.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatValue(opp.value)}원
                      </div>
                      <div>확률: {opp.probability}%</div>
                    </div>
                  </div>
                ))}
                {stageOpportunities.length === 0 && (
                  <div className="text-center text-gray-400 py-8">데이터 없음</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingOpportunity ? '영업 기회 수정' : '영업 기회 추가'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              기회명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="예: 삼성전자 ERP 구축"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">영업 단계</label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="input"
            >
              {STAGES.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">예상 금액 (원)</label>
              <input
                type="number"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성공 확률 (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                className="input"
                placeholder="10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예상 계약일</label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              placeholder="추가 정보..."
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
            <Button type="submit">{editingOpportunity ? '수정' : '추가'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
