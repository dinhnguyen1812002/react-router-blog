import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react";
import type { Route } from "./+types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { formatDateSimple, formatNumber } from "~/lib/utils";
import { newsletterApi } from "~/api/newsletter";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin - Newsletter" },
    { name: "description", content: "Quản lý đăng ký newsletter" },
  ];
}

const PAGE_SIZE = 10;

function StatusBadge({
  isConfirmed,
  isActive,
}: {
  isConfirmed: boolean;
  isActive: boolean;
}) {
  if (!isConfirmed) {
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-200">
        <Clock className="h-3 w-3 mr-1" />
        Chờ xác nhận
      </Badge>
    );
  }

  if (isConfirmed && isActive) {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Đang hoạt động
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <XCircle className="h-3 w-3 mr-1" />
      Đã hủy
    </Badge>
  );
}

function SubscribersTable({
  title,
  description,
  isLoading,
  isFetching,
  data,
  onPrev,
  onNext,
  onRefresh,
  page,
  totalPages,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  isFetching: boolean;
  data?: Awaited<ReturnType<typeof newsletterApi.getSubscribers>>;
  onPrev: () => void;
  onNext: () => void;
  onRefresh: () => void;
  page: number;
  totalPages: number;
}) {
  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đăng ký lúc
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Xác nhận lúc
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : data && data.content.length > 0 ? (
              data.content.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {subscriber.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {subscriber.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge
                      isConfirmed={subscriber.isConfirmed}
                      isActive={subscriber.isActive}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {subscriber.subscribedAt
                      ? formatDateSimple(subscriber.subscribedAt)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {subscriber.confirmedAt
                      ? formatDateSimple(subscriber.confirmedAt)
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          Trang {page + 1} / {totalPages || 1}
          {isFetching && (
            <span className="inline-flex items-center ml-2 text-xs text-blue-600 dark:text-blue-400">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Đang cập nhật
            </span>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={page === 0 || isFetching}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={page + 1 >= totalPages || isFetching}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminNewsletterPage() {
  const [pageAll, setPageAll] = useState(0);
  const [pageActive, setPageActive] = useState(0);

  const {
    data: allSubscribers,
    isLoading: allLoading,
    isFetching: allFetching,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["newsletter", "subscribers", pageAll],
    queryFn: () => newsletterApi.getSubscribers(pageAll, PAGE_SIZE),
    // keepPreviousData: true,
  });

  const {
    data: activeSubscribers,
    isLoading: activeLoading,
    isFetching: activeFetching,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ["newsletter", "subscribers", "active", pageActive],
    queryFn: () => newsletterApi.getActiveSubscribers(pageActive, PAGE_SIZE),
    // keepPreviousData: true,
  });

  const {
    data: activeCount,
    isLoading: countLoading,
    refetch: refetchCount,
  } = useQuery({
    queryKey: ["newsletter", "subscribers", "count"],
    queryFn: () => newsletterApi.getActiveCount(),
  });

  const totalPagesAll = allSubscribers?.totalPages ?? 1;
  const totalPagesActive = activeSubscribers?.totalPages ?? 1;
  const totalAll = allSubscribers?.totalElements ?? 0;
  const totalActive = activeCount ?? activeSubscribers?.totalElements ?? 0;

  const handleRefresh = () => {
    refetchAll();
    refetchActive();
    refetchCount();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Newsletter
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Theo dõi và quản lý người đăng ký theo tài liệu API newsletter.
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex items-center space-x-3">
          <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tổng đăng ký</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {allLoading ? "—" : formatNumber(totalAll)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex items-center space-x-3">
          <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Đang hoạt động</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {countLoading ? "—" : formatNumber(totalActive)}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex items-center space-x-3">
          <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30">
            <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chờ xác nhận</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {allLoading
                ? "—"
                : formatNumber(
                  (allSubscribers?.content || []).filter((s) => !s.isConfirmed).length
                )}
            </p>
          </div>
        </div>
      </div>

      <SubscribersTable
        title="Tất cả người đăng ký"
        description="Bao gồm cả chưa xác nhận (theo API /newsletter/subscribers)"
        isLoading={allLoading}
        isFetching={allFetching}
        data={allSubscribers}
        onPrev={() => setPageAll((p) => Math.max(p - 1, 0))}
        onNext={() => setPageAll((p) => Math.min(p + 1, totalPagesAll - 1))}
        onRefresh={() => refetchAll()}
        page={pageAll}
        totalPages={totalPagesAll}
      />

      <SubscribersTable
        title="Người đăng ký đã kích hoạt"
        description="Chỉ những người đã xác nhận và còn hoạt động (/newsletter/subscribers/active)"
        isLoading={activeLoading}
        isFetching={activeFetching}
        data={activeSubscribers}
        onPrev={() => setPageActive((p) => Math.max(p - 1, 0))}
        onNext={() => setPageActive((p) => Math.min(p + 1, totalPagesActive - 1))}
        onRefresh={() => refetchActive()}
        page={pageActive}
        totalPages={totalPagesActive}
      />
    </div>
  );
}
