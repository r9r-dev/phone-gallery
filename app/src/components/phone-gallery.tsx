"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Smartphone, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { ThemeProvider } from "next-themes";
import { PhoneStatistics } from "./phone-statistics";
import { phones } from "./phones";

export type Phone = {
  brand: string;
  name: string;
  yearStart: number;
  yearEnd: number | null;
  kept: boolean;
  liked: boolean;
  image: string;
};

export default function PhoneGallery() {
  // Sort phones from most recent to oldest
  const sortedPhones = [...phones].sort((a, b) => {
    const aEndYear = a.yearEnd || new Date().getFullYear();
    const bEndYear = b.yearEnd || new Date().getFullYear();
    return bEndYear - aEndYear || b.yearStart - a.yearStart;
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Phone History</h1>
          <ThemeToggle />
        </div>
        <Tabs defaultValue="gallery" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="stats">Facts & Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPhones.map((phone, index) => (
                <Card key={index} className="overflow-hidden flex flex-col">
                  <CardHeader className="p-4">
                    <h2 className="text-lg font-bold uppercase">
                      {phone.brand}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {phone.name}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-center mb-4">
                      <Image
                        src={phone.image}
                        alt={`${phone.brand} ${phone.name}`}
                        width={150}
                        height={150}
                        className="rounded-md"
                      />
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm">
                          Owned: {phone.yearStart} -{" "}
                          {phone.yearEnd || "Present"}
                        </p>
                        {phone.liked ? (
                          <ThumbsUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <ThumbsDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phone.yearEnd === null && (
                          <Badge
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Current</span>
                          </Badge>
                        )}
                        {phone.kept && (
                          <Badge
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            <Heart className="w-3 h-3" />
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
