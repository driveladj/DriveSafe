
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define the type for a traffic sign fetched from Firestore
interface TrafficSign {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}

// Async function to fetch signs from Firestore
// This enables Server-Side Rendering (SSR) with dynamic data
async function getTrafficSigns(): Promise<TrafficSign[]> {
    try {
        const signsCollection = collection(db, 'trafficSigns');
        const q = query(signsCollection, orderBy("name", "asc"));
        const querySnapshot = await getDocs(q);
        
        const signs: TrafficSign[] = [];
        querySnapshot.forEach((doc) => {
            signs.push({ id: doc.id, ...doc.data() } as TrafficSign);
        });

        return signs;
    } catch (error) {
        console.error("Error fetching traffic signs for public page: ", error);
        // Return an empty array in case of an error to prevent the page from crashing
        return []; 
    }
}

export default async function TrafficSignsPage() {
  // Fetch the signs when the page is rendered on the server
  const trafficSigns = await getTrafficSigns();

  return (
    <>
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">إشارات المرور الهامة</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            دليل مرجعي سريع لبعض أهم وأشهر إشارات الطرق التي ستواجهها.
          </p>
        </div>
      </section>
      
      <section className="py-16 sm:py-24">
        <div className="container">
          {trafficSigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {trafficSigns.map((sign) => (
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
          ) : (
            <div className="text-center py-12">
                <h3 className="text-2xl font-semibold">لا توجد إشارات مرور لعرضها</h3>
                <p className="text-muted-foreground mt-2">يرجى من المدير إضافة بعض الإشارات من خلال لوحة التحكم.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
