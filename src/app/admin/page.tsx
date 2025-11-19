"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import type { Phone } from "@/types/phone";
import { ThemeProvider } from "next-themes";
import { LanguageToggle } from "@/components/language-toggle";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import Link from "next/link";

function AdminPageContent() {
  const { t } = useLanguage();
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
      image: '',
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
    if (!confirm(t('deleteConfirm'))) return;

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
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">Phone Image</label>
                  <FileUpload
                    value={formData.image || ''}
                    onChange={(value) => setFormData({ ...formData, image: value })}
                    className="glass"
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

                {/* Review Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('myReview')}
                  </h3>
                  <Textarea
                    value={formData.review || ''}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                    className="glass min-h-[100px]"
                    placeholder="Your review of this phone..."
                  />
                </div>

                {/* Network Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('network')}
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('networkTechnology')}</label>
                  <Input
                    value={formData.networkTechnology || ''}
                    onChange={(e) => setFormData({ ...formData, networkTechnology: e.target.value })}
                    className="glass"
                    placeholder="GSM / CDMA / HSPA / LTE / 5G"
                  />
                </div>

                {/* Launch Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('launch')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('launchDateInternational')}</label>
                  <Input
                    value={formData.launchDateInternational || ''}
                    onChange={(e) => setFormData({ ...formData, launchDateInternational: e.target.value })}
                    className="glass"
                    placeholder="2024, September"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('launchDateFrance')}</label>
                  <Input
                    value={formData.launchDateFrance || ''}
                    onChange={(e) => setFormData({ ...formData, launchDateFrance: e.target.value })}
                    className="glass"
                    placeholder="2024, October"
                  />
                </div>

                {/* Body Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('body')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('dimensions')}</label>
                  <Input
                    value={formData.dimensions || ''}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="glass"
                    placeholder="159.9 x 76.7 x 8.3 mm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('weight')}</label>
                  <Input
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="glass"
                    placeholder="227 g"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('sim')}</label>
                  <Input
                    value={formData.sim || ''}
                    onChange={(e) => setFormData({ ...formData, sim: e.target.value })}
                    className="glass"
                    placeholder="Nano-SIM and eSIM"
                  />
                </div>

                {/* Display Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('display')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('displayType')}</label>
                  <Input
                    value={formData.displayType || ''}
                    onChange={(e) => setFormData({ ...formData, displayType: e.target.value })}
                    className="glass"
                    placeholder="LTPO Super Retina XDR OLED"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('displaySize')}</label>
                  <Input
                    value={formData.displaySize || ''}
                    onChange={(e) => setFormData({ ...formData, displaySize: e.target.value })}
                    className="glass"
                    placeholder="6.3 inches"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('displayResolution')}</label>
                  <Input
                    value={formData.displayResolution || ''}
                    onChange={(e) => setFormData({ ...formData, displayResolution: e.target.value })}
                    className="glass"
                    placeholder="1206 x 2622 pixels"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('displayProtection')}</label>
                  <Input
                    value={formData.displayProtection || ''}
                    onChange={(e) => setFormData({ ...formData, displayProtection: e.target.value })}
                    className="glass"
                    placeholder="Ceramic Shield glass"
                  />
                </div>

                {/* Platform Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('platform')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('os')}</label>
                  <Input
                    value={formData.os || ''}
                    onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                    className="glass"
                    placeholder="iOS"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('osVersion')}</label>
                  <Input
                    value={formData.osVersion || ''}
                    onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
                    className="glass"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('chipset')}</label>
                  <Input
                    value={formData.chipset || ''}
                    onChange={(e) => setFormData({ ...formData, chipset: e.target.value })}
                    className="glass"
                    placeholder="Apple A18 Pro (3 nm)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('cpu')}</label>
                  <Input
                    value={formData.cpu || ''}
                    onChange={(e) => setFormData({ ...formData, cpu: e.target.value })}
                    className="glass"
                    placeholder="Hexa-core"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('gpu')}</label>
                  <Input
                    value={formData.gpu || ''}
                    onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                    className="glass"
                    placeholder="Apple GPU (6-core graphics)"
                  />
                </div>

                {/* Memory Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('memory')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('internalMemory')}</label>
                  <Input
                    value={formData.internalMemory || ''}
                    onChange={(e) => setFormData({ ...formData, internalMemory: e.target.value })}
                    className="glass"
                    placeholder="256GB, 512GB, 1TB"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('ram')}</label>
                  <Input
                    value={formData.ram || ''}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="glass"
                    placeholder="8GB"
                  />
                </div>

                {/* Main Camera Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('mainCamera')}
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('cameraSpecs')}</label>
                  <Textarea
                    value={formData.mainCameraSpecs || ''}
                    onChange={(e) => setFormData({ ...formData, mainCameraSpecs: e.target.value })}
                    className="glass"
                    placeholder="48 MP (wide), 48 MP (ultrawide), 12 MP (telephoto)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('cameraVideo')}</label>
                  <Input
                    value={formData.mainCameraVideo || ''}
                    onChange={(e) => setFormData({ ...formData, mainCameraVideo: e.target.value })}
                    className="glass"
                    placeholder="4K@24/25/30/60fps, 1080p@25/30/60/120/240fps"
                  />
                </div>

                {/* Selfie Camera Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('selfieCamera')}
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('cameraSpecs')}</label>
                  <Input
                    value={formData.selfieCameraSpecs || ''}
                    onChange={(e) => setFormData({ ...formData, selfieCameraSpecs: e.target.value })}
                    className="glass"
                    placeholder="12 MP (wide)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('cameraVideo')}</label>
                  <Input
                    value={formData.selfieCameraVideo || ''}
                    onChange={(e) => setFormData({ ...formData, selfieCameraVideo: e.target.value })}
                    className="glass"
                    placeholder="4K@24/25/30/60fps, 1080p@25/30/60/120fps"
                  />
                </div>

                {/* Sound Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('sound')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('speakers')}</label>
                  <Input
                    value={formData.speakers || ''}
                    onChange={(e) => setFormData({ ...formData, speakers: e.target.value })}
                    className="glass"
                    placeholder="Stereo speakers"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('jack35mm')}</label>
                  <Input
                    value={formData.jack35mm || ''}
                    onChange={(e) => setFormData({ ...formData, jack35mm: e.target.value })}
                    className="glass"
                    placeholder="No"
                  />
                </div>

                {/* Communication Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('communication')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('wlan')}</label>
                  <Input
                    value={formData.wlan || ''}
                    onChange={(e) => setFormData({ ...formData, wlan: e.target.value })}
                    className="glass"
                    placeholder="Wi-Fi 802.11 a/b/g/n/ac/6e/7"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('bluetooth')}</label>
                  <Input
                    value={formData.bluetooth || ''}
                    onChange={(e) => setFormData({ ...formData, bluetooth: e.target.value })}
                    className="glass"
                    placeholder="5.3, A2DP, LE"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('positioning')}</label>
                  <Input
                    value={formData.positioning || ''}
                    onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
                    className="glass"
                    placeholder="GPS, GLONASS, GALILEO, QZSS, BDS"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('nfc')}</label>
                  <Input
                    value={formData.nfc || ''}
                    onChange={(e) => setFormData({ ...formData, nfc: e.target.value })}
                    className="glass"
                    placeholder="Yes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('infraredPort')}</label>
                  <Input
                    value={formData.infraredPort || ''}
                    onChange={(e) => setFormData({ ...formData, infraredPort: e.target.value })}
                    className="glass"
                    placeholder="No"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('radio')}</label>
                  <Input
                    value={formData.radio || ''}
                    onChange={(e) => setFormData({ ...formData, radio: e.target.value })}
                    className="glass"
                    placeholder="No"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('usb')}</label>
                  <Input
                    value={formData.usb || ''}
                    onChange={(e) => setFormData({ ...formData, usb: e.target.value })}
                    className="glass"
                    placeholder="USB Type-C 3.2 Gen 2"
                  />
                </div>

                {/* Features Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('features')}
                  </h3>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block">{t('sensors')}</label>
                  <Input
                    value={formData.sensors || ''}
                    onChange={(e) => setFormData({ ...formData, sensors: e.target.value })}
                    className="glass"
                    placeholder="Face ID, accelerometer, gyro, proximity, compass, barometer"
                  />
                </div>

                {/* Battery Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('battery')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('batteryType')}</label>
                  <Input
                    value={formData.batteryType || ''}
                    onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                    className="glass"
                    placeholder="Li-Ion"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('batteryCapacity')}</label>
                  <Input
                    value={formData.batteryCapacity || ''}
                    onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                    className="glass"
                    placeholder="3582 mAh"
                  />
                </div>

                {/* My Phone Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    {t('myPhone')}
                  </h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('color')}</label>
                  <Input
                    value={formData.myPhoneColor || ''}
                    onChange={(e) => setFormData({ ...formData, myPhoneColor: e.target.value })}
                    className="glass"
                    placeholder="Black Titanium"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('storage')}</label>
                  <Input
                    value={formData.myPhoneStorage || ''}
                    onChange={(e) => setFormData({ ...formData, myPhoneStorage: e.target.value })}
                    className="glass"
                    placeholder="256GB"
                  />
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

export default function AdminPage() {
  return (
    <LanguageProvider>
      <AdminPageContent />
    </LanguageProvider>
  );
}
