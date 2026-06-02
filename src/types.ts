export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "EDITOR" | "VIEWER";

export type Platform = "INSTAGRAM" | "FACEBOOK" | "LINKEDIN" | "TWITTER" | "YOUTUBE";

export type PostStatus = 
  | "DRAFT" 
  | "PENDING_APPROVAL" 
  | "APPROVED" 
  | "SCHEDULED" 
  | "PUBLISHING" 
  | "PUBLISHED" 
  | "FAILED" 
  | "CANCELLED";

export type PlanType = "STARTER" | "PRO" | "AGENCY";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: Role;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  brandColor?: string;
  createdAt: string;
}

export interface SocialAccount {
  id: string;
  workspaceId: string;
  platform: Platform;
  accountName: string;
  accountHandle?: string;
  accountAvatar?: string;
  sessionValid: boolean;
  lastVerified?: string;
  proxyUrl?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  workspaceId: string;
  createdById: string;
  approvedById?: string;
  title?: string;
  caption: string;
  mediaUrls: string[];
  platforms: Platform[];
  scheduledAt?: string;
  publishedAt?: string;
  status: PostStatus;
  isRecurring: boolean;
  recurringRule?: {
    frequency: "daily" | "weekly" | "monthly";
    interval: number;
  };
  campaignId?: string;
  tags: string[];
  approvalNote?: string;
  createdAt: string;
}

export interface PublishResult {
  id: string;
  postId: string;
  socialAccountId: string;
  platform: Platform;
  status: PostStatus;
  publishedUrl?: string;
  screenshotUrl?: string;
  errorMessage?: string;
  attemptCount: number;
  publishedAt?: string;
}

export interface ScheduledJob {
  id: string;
  postId: string;
  bullJobId?: string;
  scheduledAt: string;
  status: "active" | "delayed" | "completed" | "failed" | "paused";
  attempts: number;
  lastAttemptAt?: string;
  logs: string[];
  createdAt: string;
}

export interface MediaFile {
  id: string;
  workspaceId: string;
  uploadedById: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  tags: string[];
  createdAt: string;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  plan: PlanType;
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface AnalyticsSummary {
  totalPublished: number;
  successRate: number;
  mostActivePlatform: Platform;
  bestPerformingDay: string;
  postsPublishedOverTime: Array<{ date: string; posts: number }>;
  postsPerPlatform: Array<{ platform: Platform; count: number }>;
  successVsFailed: Array<{ name: string; value: number }>;
}
