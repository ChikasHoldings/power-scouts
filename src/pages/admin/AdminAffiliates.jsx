import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Link2, Plus, Pencil, Trash2, Search, ExternalLink,
  ToggleLeft, ToggleRight, BarChart3, MousePointerClick,
  Copy, Check, AlertCircle, X
} from "lucide-react";

export default function AdminAffiliates() {
  const [links, setLinks] = useState([]);
  const [providers, setProviders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [clickCounts, setClickCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    slug: "",
    target_url: "",
    label: "",
    provider_id: "",
    offer_id: "",
    is_active: true,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      // Fetch affiliate links
      const { data: linksData, error: linksErr } = await supabase
        .from("affiliate_links")
        .select("*, electricity_providers(id, name), electricity_plans(id, plan_name, provider_name)")
        .order("created_at", { ascending: false });

      if (linksErr) throw linksErr;
      setLinks(linksData || []);

      // Fetch providers for dropdown
      const { data: provData } = await supabase
        .from("electricity_providers")
        .select("id, name")
        .order("name");
      setProviders(provData || []);

      // Fetch plans for dropdown
      const { data: planData } = await supabase
        .from("electricity_plans")
        .select("id, plan_name, provider_name")
        .order("plan_name");
      setPlans(planData || []);

      // Fetch click counts per slug
      const { data: clicks } = await supabase
        .from("click_tracking")
        .select("slug");

      const counts = {};
      (clicks || []).forEach((c) => {
        counts[c.slug] = (counts[c.slug] || 0) + 1;
      });
      setClickCounts(counts);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  function resetForm() {
    setForm({
      slug: "",
      target_url: "",
      label: "",
      provider_id: "",
      offer_id: "",
      is_active: true,
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  }

  function handleEdit(link) {
    setForm({
      slug: link.slug,
      target_url: link.target_url,
      label: link.label || "",
      provider_id: link.provider_id || "",
      offer_id: link.offer_id || "",
      is_active: link.is_active,
    });
    setEditingId(link.id);
    setShowForm(true);
    setError(null);
  }

  function generateSlug(label) {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.slug || !form.target_url) {
      setError("Slug and Target URL are required.");
      return;
    }

    const payload = {
      slug: form.slug,
      target_url: form.target_url,
      label: form.label || null,
      provider_id: form.provider_id || null,
      offer_id: form.offer_id || null,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        const { error: updateErr } = await supabase
          .from("affiliate_links")
          .update(payload)
          .eq("id", editingId);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("affiliate_links")
          .insert(payload);
        if (insertErr) throw insertErr;
      }
      resetForm();
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(link) {
    try {
      const { error } = await supabase
        .from("affiliate_links")
        .update({ is_active: !link.is_active })
        .eq("id", link.id);
      if (error) throw error;
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(link) {
    if (!confirm(`Delete affiliate link "${link.slug}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase
        .from("affiliate_links")
        .delete()
        .eq("id", link.id);
      if (error) throw error;
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  }

  function copyLink(slug) {
    const url = `${window.location.origin}/go/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  const filtered = links.filter((link) => {
    const matchesSearch =
      link.slug.toLowerCase().includes(search.toLowerCase()) ||
      (link.label || "").toLowerCase().includes(search.toLowerCase()) ||
      link.target_url.toLowerCase().includes(search.toLowerCase()) ||
      (link.electricity_providers?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && link.is_active) ||
      (filterStatus === "inactive" && !link.is_active);
    return matchesSearch && matchesStatus;
  });

  const totalClicks = Object.values(clickCounts).reduce((a, b) => a + b, 0);
  const activeCount = links.filter((l) => l.is_active).length;
  const inactiveCount = links.filter((l) => !l.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
          <p className="text-gray-500 mt-1">Manage affiliate redirect links and track clicks</p>
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Affiliate Link
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Links</p>
              <p className="text-xl font-bold">{links.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ToggleRight className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ToggleLeft className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-xl font-bold">{inactiveCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MousePointerClick className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-xl font-bold">{totalClicks}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Edit Affiliate Link" : "Create Affiliate Link"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <Input
                    value={form.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      setForm({
                        ...form,
                        label,
                        slug: editingId ? form.slug : generateSlug(label),
                      });
                    }}
                    placeholder="e.g., TXU Energy Summer Deal"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">/go/</span>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="txu-energy-summer"
                      required
                    />
                  </div>
                </div>

                {/* Target URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="url"
                    value={form.target_url}
                    onChange={(e) => setForm({ ...form, target_url: e.target.value })}
                    placeholder="https://partner.example.com/signup?ref=electricscouts"
                    required
                  />
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Provider
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={form.provider_id}
                    onChange={(e) => setForm({ ...form, provider_id: e.target.value })}
                  >
                    <option value="">— None —</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Offer/Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Plan/Offer
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    value={form.offer_id}
                    onChange={(e) => setForm({ ...form, offer_id: e.target.value })}
                  >
                    <option value="">— None —</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.plan_name} ({p.provider_name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <label className="block text-sm font-medium text-gray-700">Active</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_active: !form.is_active })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.is_active ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        form.is_active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-500">
                    {form.is_active ? "Link is active" : "Link is inactive"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {editingId ? "Update Link" : "Create Link"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search by slug, label, URL, or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Links Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Link2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No affiliate links found</p>
              <p className="text-sm mt-1">
                {links.length === 0
                  ? "Create your first affiliate link to get started."
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    <th className="text-left p-3 font-medium text-gray-600">Slug / Label</th>
                    <th className="text-left p-3 font-medium text-gray-600">Provider / Offer</th>
                    <th className="text-left p-3 font-medium text-gray-600">Target URL</th>
                    <th className="text-center p-3 font-medium text-gray-600">Clicks</th>
                    <th className="text-right p-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((link) => (
                    <tr key={link.id} className="border-b hover:bg-gray-50 transition-colors">
                      {/* Status */}
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleActive(link)}
                          title={link.is_active ? "Click to deactivate" : "Click to activate"}
                        >
                          {link.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" /> Inactive
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Slug / Label */}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                            /go/{link.slug}
                          </code>
                          <button
                            onClick={() => copyLink(link.slug)}
                            className="text-gray-400 hover:text-orange-500"
                            title="Copy full URL"
                          >
                            {copiedSlug === link.slug ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {link.label && (
                          <p className="text-xs text-gray-500 mt-1">{link.label}</p>
                        )}
                      </td>

                      {/* Provider / Offer */}
                      <td className="p-3">
                        <div className="text-sm">
                          {link.electricity_providers?.name || (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                        {link.electricity_plans?.plan_name && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {link.electricity_plans.plan_name}
                          </p>
                        )}
                      </td>

                      {/* Target URL */}
                      <td className="p-3">
                        <a
                          href={link.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs flex items-center gap-1 max-w-[200px] truncate"
                          title={link.target_url}
                        >
                          {link.target_url.replace(/^https?:\/\//, "").substring(0, 40)}
                          {link.target_url.length > 40 ? "..." : ""}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </td>

                      {/* Clicks */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-medium">
                          <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
                          {clickCounts[link.slug] || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(link)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(link)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
