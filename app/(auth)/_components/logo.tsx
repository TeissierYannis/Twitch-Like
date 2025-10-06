import { Poppins } from 'next/font/google';
import { DynamicLogo } from '@/components/dynamic-logo';
import { cn } from '@/lib/utils';

const font = Poppins({
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
})

export const Logo = () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'GameHub';
    const appTagline = process.env.NEXT_PUBLIC_APP_TAGLINE || 'Stream • Play • Connect';

    return (
        <div className="flex flex-col items-center gap-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="relative bg-gradient-to-br from-card to-card/90 rounded-full p-4 border-2 border-primary/20 shadow-lg">
                    <DynamicLogo 
                        size={80}
                        className="drop-shadow-lg transition-colors duration-300"
                    />
                </div>
            </div>
            <div className={cn(
                "flex flex-col items-center space-y-2",
                font.className
            )}>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {appName}
                </h1>
                <p className="text-sm text-muted-foreground font-medium tracking-wide">
                    {appTagline}
                </p>
            </div>
        </div>
    )
}