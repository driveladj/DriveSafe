
'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import { Megaphone, Sparkle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Announcement {
    id: string;
    content: string;
    createdAt: Timestamp;
}

export default function AnnouncementBar() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const announcementsCol = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5));
                const snapshot = await getDocs(announcementsCol);
                const fetchedAnnouncements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
                setAnnouncements(fetchedAnnouncements);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading || announcements.length === 0) {
        return null;
    }

    // Duplicate the announcements to create a seamless loop
    const marqueeContent = [...announcements, ...announcements];

    return (
        <div className="bg-accent text-accent-foreground py-2 relative flex overflow-x-hidden">
            <div className="flex items-center absolute top-0 left-0 bottom-0 z-10 bg-accent pr-4 pl-2">
                 <Megaphone className="h-5 w-5" />
            </div>
            <div className="py-1 animate-marquee whitespace-nowrap flex pl-16">
                {marqueeContent.map((ann, index) => (
                    <React.Fragment key={index}>
                        <span className="text-sm mx-8">{ann.content}</span>
                        {index < marqueeContent.length - 1 && <Sparkle className="h-4 w-4 my-auto text-accent-foreground/50" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
