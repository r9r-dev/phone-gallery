"use client";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Smartphone, ThumbsDown, ThumbsUp, Loader2, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "./language-toggle";
import { ThemeProvider } from "next-themes";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { PhoneStatistics } from "./phone-statistics";
import type { Phone } from "@/types/phone";
import dynamic from 'next/dynamic';

const PhoneDetail = dynamic(() => import('./phone-detail').then(mod => mod.PhoneDetail), {
  ssr: false
});

export type { Phone };

function PhoneGalleryContent() {
  const { t } = useLanguage();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Fetch phones from API
  useEffect(() => {
    async function fetchPhones() {
      try {
        const response = await fetch('/api/phones');
        if (!response.ok) {
          throw new Error('Failed to fetch phones');
        }
        const data = await response.json();
        setPhones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching phones:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPhones();
  }, []);

  // Sort phones from most recent to oldest (memoized to avoid recomputation)
  const sortedPhones = useMemo(() => {
    return [...phones].sort((a, b) => {
      const aEndYear = a.yearEnd || new Date().getFullYear();
      const bEndYear = b.yearEnd || new Date().getFullYear();
      return bEndYear - aEndYear || b.yearStart - a.yearStart;
    });
  }, [phones]);

  // Loading state
  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="container mx-auto p-4 md:p-8 flex items-center justify-center min-h-screen">
          <div className="glass p-8 rounded-lg max-w-md text-center">
            <h2 className="text-2xl font-bold text-pink-400 mb-4">{t('error')}</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin">
              <Button variant="outline" className="glass hover:glass-strong hover:neon-purple">
                <Settings className="w-4 h-4 mr-2" />
                {t('admin')}
              </Button>
            </Link>
            <LanguageToggle />
          </div>
        </div>
        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="gallery">{t('gallery')}</TabsTrigger>
            <TabsTrigger value="stats">{t('stats')}</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPhones.map((phone) => (
                <Card
                  key={`${phone.brand}-${phone.name}-${phone.yearStart}`}
                  className={`overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    phone.liked
                      ? 'glass-liked hover:glass-liked-strong hover:neon-green'
                      : 'glass-disliked hover:glass-disliked-strong hover:neon-red'
                  }`}
                  onClick={() => {
                    setSelectedPhone(phone);
                    setDetailOpen(true);
                  }}
                >
                  <CardHeader className="p-4 md:p-6">
                    <h2 className="text-xl font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {phone.brand}
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      {phone.name}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 flex-grow flex flex-col">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Image
                          src={phone.image}
                          alt={`${phone.brand} ${phone.name}`}
                          width={150}
                          height={150}
                          className="rounded-lg transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">
                          <span className="text-muted-foreground">{t('owned')} :</span> {phone.yearStart} - {phone.yearEnd || t('present')}
                        </p>
                        {phone.liked ? (
                          <ThumbsUp className="w-5 h-5 text-green-400" />
                        ) : (
                          <ThumbsDown className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phone.yearEnd === null && (
                          <Badge
                            variant="secondary"
                            className="flex items-center space-x-1 glass border-cyan-400/30"
                          >
                            <Smartphone className="w-3 h-3 text-cyan-400" />
                            <span>{t('current')}</span>
                          </Badge>
                        )}
                        {phone.kept && (
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1 glass border-pink-400/30"
                          >
                            <Heart className="w-3 h-3 text-pink-400" />
                            <span>{t('kept')}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stats">
            <PhoneStatistics phones={phones} />
          </TabsContent>
        </Tabs>
        <PhoneDetail
          phone={selectedPhone}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </div>
    </ThemeProvider>
  );
}

export default function PhoneGallery() {
  return (
    <LanguageProvider>
      <PhoneGalleryContent />
    </LanguageProvider>
  );
}
