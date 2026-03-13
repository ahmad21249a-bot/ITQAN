import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Wrench,
  ClipboardCheck,
  Package,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { UpcomingMaintenance } from '@/components/dashboard/UpcomingMaintenance';
import { ProjectsOverview } from '@/components/dashboard/ProjectsOverview';
import { WorkOrdersChart } from '@/components/dashboard/charts/WorkOrdersChart';
import { MaintenanceTrendChart } from '@/components/dashboard/charts/MaintenanceTrendChart';
import { AssetStatusChart } from '@/components/dashboard/charts/AssetStatusChart';
import { InventoryValueChart } from '@/components/dashboard/charts/InventoryValueChart';
import { CategoryDistributionChart } from '@/components/dashboard/charts/CategoryDistributionChart';
import { PerformanceReport } from '@/components/dashboard/PerformanceReport';
import { PeriodComparison } from '@/components/dashboard/PeriodComparison';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner';
import { AnnouncementPopup } from '@/components/announcements/AnnouncementPopup';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const { stats, maintenanceMetrics, loading } = useDashboardData();

  // Enable central notification system (handles all real-time notifications)
  useNotificationSystem();

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'المستخدم';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Announcement Banner */}
        <AnnouncementBanner />
        
        {/* Announcement Popup for urgent messages */}
        <AnnouncementPopup />
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">
            {t('welcome')}, <span className="text-gradient">{userName}</span>
          </h1>
          <p className="text-muted-foreground mt-1">{t('overview')}</p>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title={t('totalProjects')}
            value={loading ? '...' : stats.totalProjects.toString()}
            subtitle={loading ? '' : `${stats.activeProjects} ${t('active')}`}
            icon={FolderKanban}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
            delay={0}
          />
          <KPICard
            title={t('activeWorkOrders')}
            value={loading ? '...' : stats.activeWorkOrders.toString()}
            subtitle={loading ? '' : `${stats.pendingWorkOrders} ${t('pending')}`}
            icon={Wrench}
            trend={{ value: stats.overdueWorkOrders, isPositive: stats.overdueWorkOrders === 0 }}
            variant="accent"
            delay={0.1}
          />
          <KPICard
            title={t('pendingApprovals')}
            value={loading ? '...' : stats.pendingApprovals.toString()}
            subtitle={loading ? '' : `${stats.urgentApprovals} ${t('urgent')}`}
            icon={ClipboardCheck}
            variant="warning"
            delay={0.2}
          />
          <KPICard
            title={t('lowStockItems')}
            value={loading ? '...' : stats.lowStockItems.toString()}
            subtitle={t('requiresAttention')}
            icon={Package}
            variant="info"
            delay={0.3}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('mttr')}
            value={loading ? '...' : `${maintenanceMetrics.mttr}h`}
            change={t('fromLastMonth')}
            changeType="positive"
            icon={Wrench}
            delay={0.1}
          />
          <StatCard
            title={t('scheduleCompliance')}
            value={loading ? '...' : `${maintenanceMetrics.scheduleCompliance}%`}
            change={t('fromLastMonth')}
            changeType={maintenanceMetrics.scheduleCompliance >= 90 ? 'positive' : 'negative'}
            icon={ClipboardCheck}
            delay={0.2}
          />
          <StatCard
            title={t('preventiveRatio')}
            value={loading ? '...' : `${maintenanceMetrics.preventiveRatio}%`}
            change={t('improvement')}
            changeType="positive"
            icon={Wrench}
            delay={0.3}
          />
          <StatCard
            title={t('completedThisMonth')}
            value={loading ? '...' : maintenanceMetrics.completedThisMonth.toString()}
            change={`${t('of')} ${maintenanceMetrics.totalThisMonth}`}
            changeType="neutral"
            icon={Package}
            delay={0.4}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkOrdersChart />
          <MaintenanceTrendChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AssetStatusChart />
          <InventoryValueChart />
          <CategoryDistributionChart />
        </div>

        {/* Performance Report */}
        <PerformanceReport />

        {/* Period Comparison */}
        <PeriodComparison />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectsOverview />
          </div>
          <div className="space-y-6">
            <ActivityFeed />
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <UpcomingMaintenance />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
