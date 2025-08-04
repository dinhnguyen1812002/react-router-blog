import { Outlet } from 'react-router';
import { DashboardLayout } from '~/components/layout/DashboardLayout';

export default function DashboardRoot() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}