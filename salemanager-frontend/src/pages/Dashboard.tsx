// Dashboard Page
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/api';
import { DashboardStats } from '@/types';
import { Users, Target, TrendingUp, FileText, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>;
  }

  if (!stats) {
    return <div className="text-center text-gray-500">데이터를 불러올 수 없습니다.</div>;
  }

  const statCards = [
    {
      title: '전체 고객',
      value: stats.customers.total,
      sub: `신규 ${stats.customers.newThisMonth}명`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: '전체 리드',
      value: stats.leads.total,
      sub: `신규 ${stats.leads.new}명`,
      icon: Target,
      color: 'bg-green-500',
    },
    {
      title: '영업 기회',
      value: stats.opportunities.total,
      sub: `총 ${(stats.opportunities.totalValue / 1000000).toFixed(1)}백만원`,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: '가중치 매출',
      value: `${(stats.opportunities.weightedValue / 1000000).toFixed(1)}M`,
      sub: '예상 매출',
      icon: DollarSign,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">영업 현황을 한눈에 확인하세요.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">영업 파이프라인</h3>
          <div className="space-y-3">
            {Object.entries(stats.opportunities.byStage).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {stage.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.opportunities.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                </div>
              </div>
            ))}
            {stats.opportunities.total === 0 && (
              <p className="text-center text-gray-500 py-4">데이터가 없습니다.</p>
            )}
          </div>
        </div>

        {/* Activities by Type */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">활동 유형별 현황</h3>
          <div className="space-y-3">
            {Object.entries(stats.activities.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {type === 'email' && '이메일'}
                  {type === 'call' && '통화'}
                  {type === 'meeting' && '미팅'}
                  {type === 'note' && '메모'}
                  {type === 'other' && '기타'}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.activities.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-6">{count}</span>
                </div>
              </div>
            ))}
            {stats.activities.total === 0 && (
              <p className="text-center text-gray-500 py-4">데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">이번 주 활동</h3>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">이번 주 {stats.activities.thisWeek}건의 활동이 있습니다.</p>
        </div>
      </div>
    </div>
  );
}
