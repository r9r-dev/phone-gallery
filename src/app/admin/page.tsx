"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import type { Phone } from "@/types/phone";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function AdminPage() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Phone>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPhones();
  }, []);

  async function fetchPhones() {
    try {
      const response = await fetch('/api/phones');
      const data = await response.json();
      setPhones(data);
    } catch (error) {
      console.error('Error fetching phones:', error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(phone: Phone) {
    setEditingId(phone.id!);
    setFormData(phone);
    setIsAdding(false);
  }

  function startAdd() {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      brand: '',
      name: '',
      yearStart: new Date().getFullYear(),
      yearEnd: null,
      kept: false,
      liked: true,
      image: '/phones/',
    });
  }

  async function handleSave() {
    try {
      if (isAdding) {
        const response = await fetch('/api/phones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          await fetchPhones();
          setIsAdding(false);
          setFormData({});
        }
      } else if (editingId) {
        const response = await fetch(`/api/phones/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          await fetchPhones();
          setEditingId(null);
          setFormData({});
        }
      }
    } catch (error) {
      console.error('Error saving phone:', error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this phone?')) return;

    try {
      const response = await fetch(`/api/phones/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchPhones();
      }
    } catch (error) {
      console.error('Error deleting phone:', error);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  }

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2">Manage your phone collection</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline" className="glass">
                Back to Gallery
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="mb-6">
          <Button
            onClick={startAdd}
            className="glass hover:glass-strong hover:neon-cyan"
            disabled={isAdding || editingId !== null}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Phone
          </Button>
        </div>

        {(isAdding || editingId) && (
          <Card className="glass mb-6 hover:glass-strong">
            <CardHeader>
              <CardTitle className="text-cyan-400">
                {isAdding ? 'Add New Phone' : 'Edit Phone'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Brand</label>
                  <Input
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="glass"
                    placeholder="Apple, Samsung, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Model Name</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass"
                    placeholder="iPhone 16 Pro"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year Start</label>
                  <Input
                    type="number"
                    value={formData.yearStart || ''}
                    onChange={(e) => setFormData({ ...formData, yearStart: parseInt(e.target.value) })}
                    className="glass"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year End (leave empty if current)</label>
                  <Input
                    type="number"
                    value={formData.yearEnd || ''}
                    onChange={(e) => setFormData({ ...formData, yearEnd: e.target.value ? parseInt(e.target.value) : null })}
                    className="glass"
                    placeholder="Leave empty if still using"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Image Path</label>
                  <Input
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="glass"
                    placeholder="/phones/phone-name.jpg"
                  />
                </div>
                <div className="flex gap-4 items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.liked || false}
                      onChange={(e) => setFormData({ ...formData, liked: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Liked</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.kept || false}
                      onChange={(e) => setFormData({ ...formData, kept: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Still Own It</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="glass hover:neon-cyan">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={cancelEdit} variant="outline" className="glass">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {phones.map((phone) => (
            <Card key={phone.id} className="glass hover:glass-strong transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {phone.brand} {phone.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {phone.yearStart} - {phone.yearEnd || 'Present'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {phone.liked && <Badge className="glass border-cyan-400/30">Liked</Badge>}
                      {phone.kept && <Badge className="glass border-pink-400/30">Kept</Badge>}
                      {!phone.yearEnd && <Badge className="glass border-purple-400/30">Current</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(phone)}
                      variant="outline"
                      size="sm"
                      className="glass hover:neon-cyan"
                      disabled={editingId !== null || isAdding}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(phone.id!)}
                      variant="outline"
                      size="sm"
                      className="glass hover:neon-pink"
                      disabled={editingId !== null || isAdding}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}
