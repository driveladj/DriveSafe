
"use client";

import { useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { useAuth } from './use-auth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Pencil } from 'lucide-react';

interface EditModeContextType {
    isEditMode: boolean;
    setIsEditMode: (isEditMode: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType>({
    isEditMode: false,
    setIsEditMode: () => {},
});

export const EditModeProvider = ({ children }: { children: ReactNode }) => {
    const { userDetails } = useAuth();
    const isAdmin = userDetails?.role === 'admin';
    const [isEditMode, setIsEditMode] = useState(false);

    const toggleEditMode = (checked: boolean) => {
        if (isAdmin) {
            setIsEditMode(checked);
        }
    };
    
    // Only provide edit mode functionality if the user is an admin
    const value = {
        isEditMode: isAdmin && isEditMode,
        setIsEditMode: toggleEditMode,
    };

    return (
        <EditModeContext.Provider value={value}>
            {children}
        </EditModeContext.Provider>
    );
};

export const useEditMode = () => useContext(EditModeContext);

export const EditModeToggle = () => {
    const { isEditMode, setIsEditMode } = useEditMode();
    const { userDetails } = useAuth();

    if (userDetails?.role !== 'admin') {
        return null;
    }

    return (
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            <Label htmlFor="edit-mode-toggle" className="flex-grow font-normal">
                وضع التحرير
            </Label>
            <Switch
                id="edit-mode-toggle"
                checked={isEditMode}
                onCheckedChange={setIsEditMode}
            />
        </DropdownMenuItem>
    );
};
