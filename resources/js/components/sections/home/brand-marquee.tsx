import Marquee from '@/components/ui/marquee';
import { CakeSlice, Droplets, Heart, Sparkles } from 'lucide-react';

const brandPhrases = [
    { text: 'Fudgy Brownies', icon: CakeSlice },
    { text: 'Ocean Milk', icon: Droplets },
    { text: 'Artisanal Craft', icon: Sparkles },
    { text: 'Bold Flavors', icon: Heart },
    { text: 'Daily Escape', icon: Droplets },
    { text: 'Mood Booster', icon: Sparkles },
    { text: 'Deep Ocean Blue', icon: CakeSlice },
    { text: 'For You', icon: Heart },
];

export function BrandMarquee() {
    return (
        <section className="border-b border-border bg-brand-muted py-6">
            <Marquee pauseOnHover className="[--duration:35s]">
                {brandPhrases.map((phrase) => {
                    const Icon = phrase.icon;
                    return (
                        <div
                            key={phrase.text}
                            className="mx-8 flex items-center gap-2.5 text-sm font-semibold tracking-wide text-muted-foreground uppercase sm:text-base"
                        >
                            <Icon className="h-4 w-4 text-brand-blue-dark" />
                            {phrase.text}
                        </div>
                    );
                })}
            </Marquee>
        </section>
    );
}
