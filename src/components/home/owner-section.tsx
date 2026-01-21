
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface OwnerContent {
  ownerName?: string;
  ownerBio?: string;
  ownerImageUrl?: string;
}

export default function OwnerSection() {
  const [content, setContent] = useState<OwnerContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const docRef = doc(db, 'pages', 'home');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent({
            ownerName: data.ownerName,
            ownerBio: data.ownerBio,
            ownerImageUrl: data.ownerImageUrl,
          });
        }
      } catch (error) {
        console.error("Error fetching owner's content: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="container text-center">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mt-6 mx-auto" />
            <Skeleton className="h-16 w-full max-w-2xl mt-4 mx-auto" />
        </div>
      </section>
    );
  }

  // Do not render the section if there is no owner name configured
  if (!content?.ownerName) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container text-center">
        <Avatar className="w-32 h-32 mx-auto border-4 border-background shadow-lg">
          <AvatarImage src={content.ownerImageUrl} alt={content.ownerName} />
          <AvatarFallback>
            {content.ownerName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-6 font-headline text-3xl font-bold">{content.ownerName}</h3>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {content.ownerBio}
        </p>
      </div>
    </section>
  );
}
