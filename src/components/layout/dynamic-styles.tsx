
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { unstable_noStore as noStore } from 'next/cache';

// Using a simple object for theme type
type Theme = { [key: string]: string };

async function getAppearanceSettings(): Promise<Theme | null> {
    noStore(); // Opt out of caching for this dynamic component
    try {
        const docRef = doc(db, 'settings', 'appearance');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as Theme;
        }
        return null;
    } catch (error) {
        console.error("Could not fetch appearance settings:", error);
        return null;
    }
}

export default async function DynamicStyles() {
    const theme = await getAppearanceSettings();

    if (!theme) {
        return null;
    }

    const cssVariables = [
        theme.fontHeadline ? `--font-headline: '${theme.fontHeadline}';` : '',
        theme.fontBody ? `--font-body: '${theme.fontBody}';` : '',
        theme.background ? `--background: ${theme.background};` : '',
        theme.foreground ? `--foreground: ${theme.foreground};` : '',
        theme.card ? `--card: ${theme.card};` : '',
        theme.cardForeground ? `--card-foreground: ${theme.cardForeground};` : '',
        theme.popover ? `--popover: ${theme.popover};` : '',
        theme.popoverForeground ? `--popover-foreground: ${theme.popoverForeground};` : '',
        theme.primary ? `--primary: ${theme.primary};` : '',
        theme.primaryForeground ? `--primary-foreground: ${theme.primaryForeground};` : '',
        theme.secondary ? `--secondary: ${theme.secondary};` : '',
        theme.secondaryForeground ? `--secondary-foreground: ${theme.secondaryForeground};` : '',
        theme.muted ? `--muted: ${theme.muted};` : '',
        theme.mutedForeground ? `--muted-foreground: ${theme.mutedForeground};` : '',
        theme.accent ? `--accent: ${theme.accent};` : '',
        theme.accentForeground ? `--accent-foreground: ${theme.accentForeground};` : '',
        theme.destructive ? `--destructive: ${theme.destructive};` : '',
        theme.destructiveForeground ? `--destructive-foreground: ${theme.destructiveForeground};` : '',
        theme.border ? `--border: ${theme.border};` : '',
        theme.input ? `--input: ${theme.input};` : '',
        theme.ring ? `--ring: ${theme.ring};` : '',
    ].filter(Boolean).join('\n');

    const css = `
:root {
    ${cssVariables}
}
    `;

    return <style>{css}</style>;
}
