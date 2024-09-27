import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ThumbsDown, ThumbsUp } from "lucide-react";

type PhoneData = {
  brand: string;
  name: string;
  yearStart: number;
  yearEnd: number | null;
  kept: boolean;
  liked: boolean;
  image: string;
};

type BrandCount = {
  [key: string]: number;
};

type Props = {
  phones: PhoneData[];
};

export function PhoneStatistics({ phones }: Props) {
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

  const mostLikedBrand = Object.entries(brandLikes).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  const mostDislikedBrand = Object.entries(brandDislikes).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  const sortedBrandCounts = Object.entries(brandCounts).sort(
    (a, b) => b[1] - a[1]
  );
  const maxCount = sortedBrandCounts[0][1];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Phones Owned
          </CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPhones}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Phones Still Owned
          </CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{phonesStillOwned}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLikes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Dislikes</CardTitle>
          <ThumbsDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDislikes}</div>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Phones by Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedBrandCounts.map(([brand, count]) => (
              <div key={brand} className="flex items-center">
                <div className="w-20 text-sm font-medium">{brand}</div>
                <div className="w-full">
                  <div
                    className="bg-primary h-2 rounded"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="w-10 text-right text-sm text-muted-foreground">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Brand Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Most Liked Brand:</span>
              <span className="font-medium">
                <span className="text-green-500">{mostLikedBrand[0]}</span>
                <span className="ml-2">({mostLikedBrand[1]})</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Most Disliked Brand:</span>
              <span className="font-medium">
                <span className="text-red-500">{mostDislikedBrand[0]}</span>
                <span className="ml-2">({mostDislikedBrand[1]})</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
