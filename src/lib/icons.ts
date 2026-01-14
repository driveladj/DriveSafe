
import { Car, Truck, Bus, Bike, CarFront, type LucideProps } from 'lucide-react';
import React from 'react';

export const ICONS = {
    Car: { component: Car, label: 'سيارة' },
    Truck: { component: Truck, label: 'شاحنة' },
    Bus: { component: Bus, label: 'حافلة' },
    Bike: { component: Bike, label: 'دراجة نارية' },
    CarFront: { component: CarFront, label: 'سيارة (أمامي)' },
};

type IconName = keyof typeof ICONS;

interface IconProps extends LucideProps {
  name: IconName;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = ICONS[name] ? ICONS[name].component : Car; // Fallback to Car
  return <IconComponent {...props} />;
};
