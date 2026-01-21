
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { staticTrafficSigns, staticTrafficSignCategories } from "@/lib/data";

// Define the types for data
interface TrafficSignCategory {
    id: string;
    name: string;
    description?: string;
}

interface TrafficSign {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    categoryId: string;
}

// In the offline version, we use static data directly.
const allSigns = staticTrafficSigns;
const allCategories = staticTrafficSignCategories;

export default function TrafficSignsPage() {
  
  const signsByCategory = allCategories.map(category => ({
    ...category,
    signs: allSigns.filter(sign => sign.categoryId === category.id)
  })).filter(category => category.signs.length > 0);

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">دليل إشارات المرور</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            دليل مرجعي شامل ومصنف لأهم إشارات الطرق التي ستواجهها.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container space-y-16">
          {signsByCategory.length > 0 ? (
            signsByCategory.map(category => (
              <div key={category.id}>
                <div className="mb-8 border-b pb-4">
                  <h2 className="font-headline text-3xl font-bold text-primary">{category.name}</h2>
                  {category.description && <p className="mt-2 text-muted-foreground">{category.description}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {category.signs.map((sign) => (
                    <Card key={sign.id} className="text-center flex flex-col">
                      <CardHeader className="flex-grow">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <Image
                            src={sign.imageUrl}
                            alt={sign.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <CardTitle className="font-headline text-xl">{sign.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{sign.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
                <h3 className="text-2xl font-semibold">لا توجد إشارات مرور لعرضها</h3>
                <p className="text-muted-foreground mt-2">يرجى من المدير إضافة فئات وإشارات من خلال لوحة التحكم.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
