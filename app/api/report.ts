import axiosInstance from "~/config/axios";
import type { ApiResponse, PaginatedResponse } from "~/types";
import { apiClient } from "./client";

/** Report categories for article violations */
export type ReportCategory = 
  | "SPAM_MISLEADING"
  | "INAPPROPRIATE_LANGUAGE" 
  | "COPYRIGHT_INFRINGEMENT"
  | "MISINFORMATION"
  | "VIOLENCE_HARMFUL"
  | "OTHER";

/** Report status workflow */
export type ReportStatus = 
  | "PENDING"
  | "UNDER_REVIEW" 
  | "RESOLVED"
  | "DISMISSED";

/** Base report interface */
export interface Report {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

/** User report view (limited fields) */
export interface UserReport extends Omit<Report, "postId" | "postSlug"> {}

/** Admin report view (extended fields) */
export interface AdminReport extends Report {
  postAuthor: string;
  reporterId: string;
  reporterUsername: string;
  reporterEmail: string;
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

/** Request payload for submitting a report */
export interface CreateReportRequest {
  category: ReportCategory;
  description?: string;
}

/** Request payload for updating report status (admin only) */
export interface UpdateReportStatusRequest {
  status: Exclude<ReportStatus, "PENDING">;
  adminNotes?: string;
}

/** Query parameters for admin reports list */
export interface GetReportsParams {
  status?: ReportStatus;
  category?: ReportCategory;
  page?: number;
  size?: number;
  sort?: string;
}

/** Admin statistics response */
export interface ReportStatistics {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  reportsToday: number;
  byCategory: Record<ReportCategory, number>;
}

/** Paginated admin reports response */
export interface AdminReportsResponse extends PaginatedResponse<AdminReport> {}

export const reportApi = {
  /** Submit a report for an article */
  submitReport: async (
    postId: string,
    data: CreateReportRequest,
  ): Promise<ApiResponse<UserReport>> => {
    const response = await apiClient.post(`/posts/${postId}/report`, data);
    return response.data;
  },

  /** Get a specific report (user can only view their own) */
  getReportById: async (reportId: string): Promise<UserReport> => {
    const response = await apiClient.get(`/posts/reports/${reportId}`);
    return response.data;
  },

  /** Admin: Get all reports with filtering and pagination */
  getAdminReports: async (
    params: GetReportsParams = {},
  ): Promise<AdminReportsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.status) searchParams.append("status", params.status);
    if (params.category) searchParams.append("category", params.category);
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());
    if (params.sort) searchParams.append("sort", params.sort);

    const query = searchParams.toString();
    const response = await apiClient.get(`/admin/reports${query ? `?${query}` : ""}`);
    return response.data;
  },

  /** Admin: Get pending reports queue */
  getPendingReports: async (
    page: number = 0,
    size: number = 20,
  ): Promise<AdminReportsResponse> => {
    const response = await apiClient.get(
      `/admin/reports/pending?page=${page}&size=${size}`
    );
    return response.data;
  },

  /** Admin: Get detailed report information */
  getAdminReportById: async (reportId: string): Promise<AdminReport> => {
    const response = await apiClient.get(`/admin/reports/${reportId}`);
    return response.data;
  },

  /** Admin: Update report status with notes */
  updateReportStatus: async (
    reportId: string,
    data: UpdateReportStatusRequest,
  ): Promise<AdminReport> => {
    const response = await apiClient.put(
      `/admin/reports/${reportId}/status`,
      data
    );
    return response.data;
  },

  /** Admin: Delete a report */
  deleteReport: async (reportId: string): Promise<void> => {
    await apiClient.delete(`/admin/reports/${reportId}`);
  },

  /** Admin: Get report statistics */
  getReportStatistics: async (): Promise<ReportStatistics> => {
    const response = await apiClient.get("/admin/reports/statistics");
    return response.data;
  },
};
