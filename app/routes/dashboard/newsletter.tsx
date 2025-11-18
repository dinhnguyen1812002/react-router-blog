import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Label } from "~/components/ui/label";
import { 
  Mail, 
  Users, 
  Send, 
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Star,
  TrendingUp,
  Eye,
  Target,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { formatDateSimple, formatNumber } from "~/lib/utils";
import { useAuthStore } from "~/store/authStore";

// Import newsletter API functions
import {
  useGetNewsletterAnalytics,
  useGetNewsletterCampaigns,
  useCreateNewsletterCampaign,
  useGetNewsletterTemplates,
  useGetActiveSubscribersCount,
  type NewsletterCampaign,
  type CreateNewsletterCampaignRequest
} from "~/api/newsletter";

export default function DashboardNewsletterPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'templates'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch data
  const { data: analyticsData, isLoading: analyticsLoading } = useGetNewsletterAnalytics();
  const { data: campaignsData, isLoading: campaignsLoading } = useGetNewsletterCampaigns(0, 10);
  const { data: templatesData, isLoading: templatesLoading } = useGetNewsletterTemplates(0, 10);
  const { data: subscribersCount } = useGetActiveSubscribersCount();

  // Mutations
  const createCampaignMutation = useCreateNewsletterCampaign();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'My Campaigns', icon: Send },
    { id: 'templates', label: 'Templates', icon: Mail },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome to Newsletter Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Create and manage your email campaigns to engage with your audience.
        </p>
        <Button onClick={() => setActiveTab('campaigns')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {/* {formatNumber(subscribersCoun)} */}
                10
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Send className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campaigns Sent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(campaignsData?.content?.filter(c => c.status === 'sent').length || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Open Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(analyticsData?.data?.averageOpenRate || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Click Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(analyticsData?.data?.averageClickRate || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white dark:bg-black rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Campaigns</h3>
          <Button variant="outline" onClick={() => setActiveTab('campaigns')}>
            View All
          </Button>
        </div>
        
        {campaignsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {campaignsData?.content?.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{campaign.subject}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDateSimple(campaign.createdAt)} • {campaign.recipientCount} recipients
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={campaign.status === 'sent' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                  {campaign.status === 'sent' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {((campaign.openCount / campaign.recipientCount) * 100).toFixed(1)}% open
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {(!campaignsData?.content || campaignsData.content.length === 0) && (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No campaigns yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first email campaign to get started.
                </p>
                <Button onClick={() => setActiveTab('campaigns')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Newsletter Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Compelling Subject Lines</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep subject lines under 50 characters and create urgency or curiosity.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Optimal Send Times</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tuesday-Thursday, 10 AM - 2 PM typically see the highest open rates.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Mobile Optimization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Over 60% of emails are opened on mobile devices. Keep content concise.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">4</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Clear Call-to-Action</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use action-oriented language and make buttons stand out visually.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Newsletter Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create and manage your email campaigns
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'campaigns' && (
        <div className="text-center py-12">
          <Send className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Campaigns Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This section will be implemented with full campaign management features.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      )}
      {activeTab === 'templates' && (
        <div className="text-center py-12">
          <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Email Templates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This section will be implemented with template management features.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  );
}
