
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertTriangle } from 'lucide-react';
import AddBannerDialog from './add-banner-dialog';
import EditBannerDialog from './edit-banner-dialog';
import DeleteBannerAlert from './delete-banner-alert';
import Image from 'next/image';

export interface TrafficSign {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}

export default function BannersManagement() {
    const [signs, setSigns] = useState<TrafficSign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'trafficSigns'), orderBy('name', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const signsData: TrafficSign[] = [];
            querySnapshot.forEach((doc) => {
                signsData.push({ id: doc.id, ...doc.data() } as TrafficSign);
            });
            setSigns(signsData);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching traffic signs: ", err);
            setError('Failed to fetch traffic signs. Please try again later.');
            setLoading(false);
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    const handleBannerAdded = () => {
        // The optimistic UI update is handled by the onSnapshot listener
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive bg-destructive/10">
                <CardHeader className="flex flex-row items-center gap-4">
                     <AlertTriangle className="h-8 w-8 text-destructive" />
                    <div>
                        <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                        <CardDescription className="text-destructive/80">{error}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>All Traffic Signs</CardTitle>
                    <CardDescription>A list of all traffic signs in the database.</CardDescription>
                </div>
                <AddBannerDialog onBannerAdded={handleBannerAdded} />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {signs.length > 0 ? (
                            signs.map((sign) => (
                                <TableRow key={sign.id}>
                                    <TableCell>
                                        <Image
                                            src={sign.imageUrl}
                                            alt={sign.name}
                                            width={60}
                                            height={60}
                                            className="rounded-md object-contain aspect-square"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{sign.name}</TableCell>
                                    <TableCell className="hidden md:table-cell truncate max-w-xs">{sign.description}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <EditBannerDialog sign={sign} />
                                            <DeleteBannerAlert signId={sign.id} signName={sign.name} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No traffic signs found. Start by adding a new one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
