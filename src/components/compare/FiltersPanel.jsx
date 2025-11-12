import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FiltersPanel({ filters, setFilters }) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Type */}
        <div className="space-y-2">
          <Label>Plan Type</Label>
          <Select
            value={filters.planType}
            onValueChange={(value) => setFilters({ ...filters, planType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All plan types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fixed">Fixed Rate</SelectItem>
              <SelectItem value="variable">Variable Rate</SelectItem>
              <SelectItem value="prepaid">Prepaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contract Length */}
        <div className="space-y-2">
          <Label>Contract Length</Label>
          <Select
            value={filters.contractLength}
            onValueChange={(value) => setFilters({ ...filters, contractLength: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Length</SelectItem>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
              <SelectItem value="36">36 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Renewable Energy */}
        <div className="flex items-center justify-between">
          <Label>Renewable Energy</Label>
          <Switch
            checked={filters.renewable}
            onCheckedChange={(checked) => setFilters({ ...filters, renewable: checked })}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rate">Lowest Rate</SelectItem>
              <SelectItem value="contract">Shortest Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}