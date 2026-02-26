import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ElectricityProvider } from "@/api/supabaseEntities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Building2,
  ExternalLink,
  Star,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const emptyProvider = {
  name: "",
  description: "",
  logo_url: "",
  website_url: "",
  affiliate_url: "",
  phone: "",
  rating: 4.0,
  review_count: 0,
  supported_states: [],
  is_active: true,
  features: [],
};

export default function AdminProviders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [form, setForm] = useState(emptyProvider);
  const [statesInput, setStatesInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ["admin-providers"],
    queryFn: () => ElectricityProvider.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => ElectricityProvider.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-providers"]);
      toast({ title: "Provider created successfully" });
      closeDialog();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => ElectricityProvider.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-providers"]);
      toast({ title: "Provider updated successfully" });
      closeDialog();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ElectricityProvider.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-providers"]);
      toast({ title: "Provider deleted" });
      setDeleteConfirm(null);
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openCreate = () => {
    setEditingProvider(null);
    setForm(emptyProvider);
    setStatesInput("");
    setFeaturesInput("");
    setDialogOpen(true);
  };

  const openEdit = (provider) => {
    setEditingProvider(provider);
    setForm({ ...provider });
    setStatesInput(Array.isArray(provider.supported_states) ? provider.supported_states.join(", ") : "");
    setFeaturesInput(Array.isArray(provider.features) ? provider.features.join(", ") : "");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingProvider(null);
    setForm(emptyProvider);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      supported_states: statesInput.split(",").map((s) => s.trim()).filter(Boolean),
      features: featuresInput.split(",").map((s) => s.trim()).filter(Boolean),
      rating: parseFloat(form.rating) || 0,
      review_count: parseInt(form.review_count) || 0,
    };

    if (editingProvider) {
      updateMutation.mutate({ id: editingProvider.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = providers.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreate} className="bg-[#0A5C8C] hover:bg-[#084a6f]">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>{search ? "No providers match your search" : "No providers yet"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>States</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {provider.logo_url ? (
                            <img
                              src={provider.logo_url}
                              alt={provider.name}
                              className="w-8 h-8 rounded object-contain bg-gray-50"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{provider.name}</p>
                            {provider.website_url && (
                              <a
                                href={provider.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-400 hover:text-[#0A5C8C] flex items-center gap-1"
                              >
                                Website <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(provider.supported_states || []).slice(0, 4).map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                          {(provider.supported_states || []).length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.supported_states.length - 4}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">{provider.rating || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.is_active ? "default" : "secondary"}>
                          {provider.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(provider)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteConfirm(provider)}
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
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProvider ? "Edit Provider" : "Add New Provider"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g., TXU Energy"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., 1-800-555-0123"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the provider..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={form.logo_url || ""}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Website URL</Label>
                <Input
                  value={form.website_url || ""}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Affiliate URL</Label>
              <Input
                value={form.affiliate_url || ""}
                onChange={(e) => setForm({ ...form, affiliate_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating (0-5)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Review Count</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.review_count}
                  onChange={(e) => setForm({ ...form, review_count: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Supported States (comma-separated)</Label>
              <Input
                value={statesInput}
                onChange={(e) => setStatesInput(e.target.value)}
                placeholder="TX, IL, OH, PA, NY"
              />
            </div>

            <div className="space-y-2">
              <Label>Features (comma-separated)</Label>
              <Input
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="No deposit, Free nights, 100% renewable"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
              />
              <Label>Active (visible on website)</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#0A5C8C] hover:bg-[#084a6f]"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingProvider ? "Save Changes" : "Create Provider"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This
            action cannot be undone. All associated plans will also need to be removed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteConfirm.id)}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
