import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lead } from "@/api/supabaseEntities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Loader2,
  Users,
  Eye,
  Trash2,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  UserCheck,
  UserX,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  Zap,
  Send,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";

// ─── Status Config ──────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "new", label: "New", icon: AlertCircle, color: "bg-blue-100 text-blue-700" },
  { value: "active", label: "Active", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  { value: "nurtured", label: "Nurtured", icon: Send, color: "bg-purple-100 text-purple-700" },
  { value: "converted", label: "Converted", icon: TrendingUp, color: "bg-emerald-100 text-emerald-700" },
  { value: "unsubscribed", label: "Unsubscribed", icon: UserX, color: "bg-gray-100 text-gray-600" },
];

// ─── Source Labels ──────────────────────────────────────────
const SOURCE_LABELS = {
  'residential_comparison_results': 'Residential Results',
  'business_comparison_results': 'Business Results',
  'renewable_comparison_results': 'Renewable Results',
  'newsletter_footer': 'Newsletter (Footer)',
  'newsletter_slideup': 'Newsletter (Slide-up)',
  'homepage': 'Homepage',
  'website': 'Website',
};

const SOURCE_PAGE_LABELS = {
  'residential_results': { label: 'Residential', color: 'bg-blue-100 text-blue-700' },
  'business_results': { label: 'Business', color: 'bg-indigo-100 text-indigo-700' },
  'renewable_results': { label: 'Renewable', color: 'bg-green-100 text-green-700' },
  'newsletter_footer': { label: 'Newsletter', color: 'bg-orange-100 text-orange-700' },
  'newsletter_slideup': { label: 'Slide-up', color: 'bg-amber-100 text-amber-700' },
  'homepage': { label: 'Homepage', color: 'bg-gray-100 text-gray-600' },
  'website': { label: 'Website', color: 'bg-gray-100 text-gray-600' },
};

// ─── State Names ──────────────────────────────────────────
const STATE_NAMES = {
  'TX': 'Texas', 'OH': 'Ohio', 'PA': 'Pennsylvania', 'NY': 'New York',
  'NJ': 'New Jersey', 'MD': 'Maryland', 'IL': 'Illinois', 'CT': 'Connecticut',
  'MA': 'Massachusetts', 'ME': 'Maine', 'NH': 'New Hampshire', 'RI': 'Rhode Island',
};

function getStatusBadge(status) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  const Icon = opt.icon;
  return (
    <Badge variant="outline" className={`${opt.color} border-0`}>
      <Icon className="w-3 h-3 mr-1" />
      {opt.label}
    </Badge>
  );
}

function getSourceBadge(sourcePage) {
  const config = SOURCE_PAGE_LABELS[sourcePage] || { label: sourcePage || 'Unknown', color: 'bg-gray-100 text-gray-600' };
  return (
    <Badge variant="outline" className={`${config.color} border-0 text-xs`}>
      {config.label}
    </Badge>
  );
}

export default function AdminLeads() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [viewLead, setViewLead] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ─── Data Fetching ──────────────────────────────────────
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: () => Lead.list(),
  });

  // ─── Mutations ──────────────────────────────────────────
  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => Lead.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-leads"]);
      toast({ title: "Lead status updated" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: (id) => Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-leads"]);
      setDeleteConfirm(null);
      toast({ title: "Lead deleted" });
    },
  });

  // ─── Computed Stats ──────────────────────────────────────
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter(l => l.status === 'new').length;
    const activeCount = leads.filter(l => l.status === 'active').length;
    const convertedCount = leads.filter(l => l.status === 'converted').length;
    const residentialCount = leads.filter(l => l.source_page === 'residential_results' || l.source?.includes('residential')).length;
    const businessCount = leads.filter(l => l.source_page === 'business_results' || l.source?.includes('business')).length;
    const renewableCount = leads.filter(l => l.source_page === 'renewable_results' || l.source?.includes('renewable')).length;
    const newsletterCount = leads.filter(l => l.source_page?.includes('newsletter') || l.source?.includes('newsletter')).length;
    const todayCount = leads.filter(l => {
      const d = new Date(l.created_at);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length;
    return { total, newCount, activeCount, convertedCount, residentialCount, businessCount, renewableCount, newsletterCount, todayCount };
  }, [leads]);

  // ─── Filtering ──────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const match = (lead.email || '').toLowerCase().includes(q) ||
          (lead.name || '').toLowerCase().includes(q) ||
          (lead.zip || '').includes(q) ||
          (lead.city || '').toLowerCase().includes(q) ||
          (lead.state || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      // Status filter
      if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
      // Source filter
      if (filterSource !== 'all') {
        if (filterSource === 'residential' && !lead.source?.includes('residential') && lead.source_page !== 'residential_results') return false;
        if (filterSource === 'business' && !lead.source?.includes('business') && lead.source_page !== 'business_results') return false;
        if (filterSource === 'renewable' && !lead.source?.includes('renewable') && lead.source_page !== 'renewable_results') return false;
        if (filterSource === 'newsletter' && !lead.source?.includes('newsletter') && !lead.source_page?.includes('newsletter')) return false;
      }
      // State filter
      if (filterState !== 'all' && lead.state !== filterState) return false;
      return true;
    });
  }, [leads, search, filterStatus, filterSource, filterState]);

  // ─── Export CSV ──────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Name', 'Email', 'ZIP', 'City', 'State', 'Source', 'Source Page', 'Status', 'Created At'];
    const rows = filteredLeads.map(l => [
      l.name || '', l.email, l.zip || '', l.city || '', 
      l.state ? STATE_NAMES[l.state] || l.state : '',
      SOURCE_LABELS[l.source] || l.source || '',
      l.source_page || '',
      l.status || '',
      new Date(l.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electric-scouts-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${filteredLeads.length} leads` });
  };

  // ─── Unique States for Filter ──────────────────────────
  const uniqueStates = useMemo(() => {
    const states = [...new Set(leads.map(l => l.state).filter(Boolean))].sort();
    return states;
  }, [leads]);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#0A5C8C]" />
              Lead Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total} total leads · {stats.todayCount} today · {stats.newCount} new
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries(["admin-leads"])}
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
            >
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">New</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.newCount}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">Converted</p>
              <p className="text-2xl font-bold text-green-600">{stats.convertedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">Residential</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.residentialCount}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">Newsletter</p>
              <p className="text-2xl font-bold text-orange-600">{stats.newsletterCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, ZIP, city, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="renewable">Renewable</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {uniqueStates.map(s => (
                <SelectItem key={s} value={s}>{STATE_NAMES[s] || s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="text-xs text-gray-500 mb-3">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A5C8C]" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No leads found</p>
            <p className="text-sm mt-1">Leads will appear here as users sign up</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {lead.name || <span className="text-gray-400 italic">No name</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">{lead.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <div className="text-sm">
                            {lead.city && <span className="text-gray-700">{lead.city}, </span>}
                            {lead.state && <span className="font-medium text-gray-900">{lead.state}</span>}
                            {lead.zip && <span className="text-gray-500 ml-1">({lead.zip})</span>}
                            {!lead.city && !lead.state && !lead.zip && (
                              <span className="text-gray-400 italic">Unknown</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSourceBadge(lead.source_page || lead.source)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(lead.created_at).toLocaleTimeString('en-US', { 
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewLead(lead)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => setDeleteConfirm(lead)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* View Lead Dialog */}
        <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#0A5C8C]" />
                Lead Details
              </DialogTitle>
            </DialogHeader>
            {viewLead && (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{viewLead.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                    <p className="text-sm text-gray-900 break-all">{viewLead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">ZIP Code</p>
                    <p className="text-sm text-gray-900">{viewLead.zip || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">City</p>
                    <p className="text-sm text-gray-900">{viewLead.city || 'Not resolved'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">State</p>
                    <p className="text-sm text-gray-900">
                      {viewLead.state ? `${STATE_NAMES[viewLead.state] || viewLead.state} (${viewLead.state})` : 'Not resolved'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Source</p>
                    <p className="text-sm text-gray-900">{SOURCE_LABELS[viewLead.source] || viewLead.source || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Source Page</p>
                    {getSourceBadge(viewLead.source_page || viewLead.source)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Created</p>
                    <p className="text-sm text-gray-900">{new Date(viewLead.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Search Preferences */}
                {viewLead.search_preferences && Object.keys(viewLead.search_preferences).length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">Search Preferences</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                      {viewLead.search_preferences.comparisonType && (
                        <p><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{viewLead.search_preferences.comparisonType}</span></p>
                      )}
                      {viewLead.search_preferences.monthlyUsage && (
                        <p><span className="text-gray-500">Monthly Usage:</span> <span className="font-medium">{viewLead.search_preferences.monthlyUsage} kWh</span></p>
                      )}
                      {viewLead.search_preferences.topPlans && viewLead.search_preferences.topPlans.length > 0 && (
                        <div>
                          <p className="text-gray-500 mb-1">Top Plans Viewed:</p>
                          {viewLead.search_preferences.topPlans.map((plan, i) => (
                            <p key={i} className="ml-2 text-xs">
                              {i + 1}. {plan.provider} — {plan.name} ({plan.rate}¢/kWh)
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Follow-up Info */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">Follow-up Status</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Follow-ups sent:</span>{' '}
                      <span className="font-medium">{viewLead.follow_up_count || 0}</span>
                    </div>
                    {viewLead.follow_up_sent_at && (
                      <div>
                        <span className="text-gray-500">Last follow-up:</span>{' '}
                        <span className="font-medium">{new Date(viewLead.follow_up_sent_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(opt => (
                      <Button
                        key={opt.value}
                        variant={viewLead.status === opt.value ? "default" : "outline"}
                        size="sm"
                        className={viewLead.status === opt.value ? "bg-[#0A5C8C]" : ""}
                        onClick={() => {
                          updateStatus.mutate({ id: viewLead.id, status: opt.value });
                          setViewLead({ ...viewLead, status: opt.value });
                        }}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Lead</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete the lead for <strong>{deleteConfirm?.email}</strong>? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => deleteLead.mutate(deleteConfirm.id)}
                disabled={deleteLead.isPending}
              >
                {deleteLead.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
