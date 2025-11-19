"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone as PhoneIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Phone } from "@/types/phone";

type BrandCount = {
  [key: string]: number;
};

type Props = {
  phones: Phone[];
};

export function PhoneStatistics({ phones }: Props) {
  const statistics = useMemo(() => {
    const totalPhones = phones.length;
    const phonesStillOwned = phones.filter((phone) => phone.kept).length;
    const totalLikes = phones.filter((phone) => phone.liked).length;
    const totalDislikes = phones.filter((phone) => !phone.liked).length;

    const brandCounts: BrandCount = phones.reduce((acc, phone) => {
      acc[phone.brand] = (acc[phone.brand] || 0) + 1;
      return acc;
    }, {} as BrandCount);

    const brandLikes: BrandCount = phones.reduce((acc, phone) => {
      if (phone.liked) {
        acc[phone.brand] = (acc[phone.brand] || 0) + 1;
      }
      return acc;
    }, {} as BrandCount);

    const brandDislikes: BrandCount = phones.reduce((acc, phone) => {
      if (!phone.liked) {
        acc[phone.brand] = (acc[phone.brand] || 0) + 1;
      }
      return acc;
    }, {} as BrandCount);

    const brandLikesEntries = Object.entries(brandLikes);
    const brandDislikesEntries = Object.entries(brandDislikes);

    const mostLikedBrand = brandLikesEntries.length > 0
      ? brandLikesEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
      : null;

    const mostDislikedBrand = brandDislikesEntries.length > 0
      ? brandDislikesEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
      : null;

    const sortedBrandCounts = Object.entries(brandCounts).sort(
      (a, b) => b[1] - a[1]
    );
    const maxCount = sortedBrandCounts.length > 0 ? sortedBrandCounts[0][1] : 1;

    return {
      totalPhones,
      phonesStillOwned,
      totalLikes,
      totalDislikes,
      sortedBrandCounts,
      maxCount,
      mostLikedBrand,
      mostDislikedBrand,
    };
  }, [phones]);

  const {
    totalPhones,
    phonesStillOwned,
    totalLikes,
    totalDislikes,
    sortedBrandCounts,
    maxCount,
    mostLikedBrand,
    mostDislikedBrand,
  } = statistics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="glass hover:glass-strong transition-all hover:neon-cyan">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Phones Owned
          </CardTitle>
          <PhoneIcon className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{totalPhones}</div>
        </CardContent>
      </Card>
      <Card className="glass hover:glass-strong transition-all hover:neon-purple">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Phones Still Owned
          </CardTitle>
          <PhoneIcon className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{phonesStillOwned}</div>
        </CardContent>
      </Card>
      <Card className="glass hover:glass-strong transition-all hover:neon-cyan">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <ThumbsUp className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-cyan-400">{totalLikes}</div>
        </CardContent>
      </Card>
      <Card className="glass hover:glass-strong transition-all hover:neon-pink">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dislikes</CardTitle>
          <ThumbsDown className="h-4 w-4 text-pink-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-pink-400">{totalDislikes}</div>
        </CardContent>
      </Card>
      <Card className="col-span-full glass hover:glass-strong transition-all">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Phones by Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedBrandCounts.map(([brand, count]) => (
              <div key={brand} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium">{brand}</div>
                <div className="flex-1">
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-bold text-cyan-400">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-1 glass hover:glass-strong transition-all">
        <CardHeader>
          <CardTitle>Brand Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg glass">
              <span className="text-sm">Most Liked Brand:</span>
              <span className="font-bold">
                {mostLikedBrand ? (
                  <>
                    <span className="text-cyan-400">{mostLikedBrand[0]}</span>
                    <span className="ml-2 text-muted-foreground">({mostLikedBrand[1]})</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg glass">
              <span className="text-sm">Most Disliked Brand:</span>
              <span className="font-bold">
                {mostDislikedBrand ? (
                  <>
                    <span className="text-pink-400">{mostDislikedBrand[0]}</span>
                    <span className="ml-2 text-muted-foreground">({mostDislikedBrand[1]})</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
