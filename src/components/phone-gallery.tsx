"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Smartphone, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { ThemeProvider } from "next-themes";
import { PhoneStatistics } from "./phone-statistics";
import { phones } from "./phones";
import type { Phone } from "@/types/phone";

export type { Phone };

export default function PhoneGallery() {
  // Sort phones from most recent to oldest (memoized to avoid recomputation)
  const sortedPhones = useMemo(() => {
    return [...phones].sort((a, b) => {
      const aEndYear = a.yearEnd || new Date().getFullYear();
      const bEndYear = b.yearEnd || new Date().getFullYear();
      return bEndYear - aEndYear || b.yearStart - a.yearStart;
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Phone Gallery
            </h1>
            <p className="text-muted-foreground mt-2">A journey through mobile history</p>
          </div>
          <ThemeToggle />
        </div>
        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="stats">Facts & Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPhones.map((phone) => (
                <Card
                  key={`${phone.brand}-${phone.name}-${phone.yearStart}`}
                  className="overflow-hidden flex flex-col glass hover:glass-strong transition-all duration-300 hover:scale-[1.02] hover:neon-cyan"
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
                          <span className="text-muted-foreground">Owned:</span> {phone.yearStart} - {phone.yearEnd || "Present"}
                        </p>
                        {phone.liked ? (
                          <ThumbsUp className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <ThumbsDown className="w-5 h-5 text-pink-400" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phone.yearEnd === null && (
                          <Badge
                            variant="secondary"
                            className="flex items-center space-x-1 glass border-cyan-400/30"
                          >
                            <Smartphone className="w-3 h-3 text-cyan-400" />
                            <span>Current</span>
                          </Badge>
                        )}
                        {phone.kept && (
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1 glass border-pink-400/30"
                          >
                            <Heart className="w-3 h-3 text-pink-400" />
                            <span>Kept</span>
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
      </div>
    </ThemeProvider>
  );
}
