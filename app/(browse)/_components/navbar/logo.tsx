import Link from "next/link";
import {Poppins} from 'next/font/google';
import { DynamicLogo } from '@/components/dynamic-logo';
import {cn} from '@/lib/utils';

const font = Poppins({
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
})

export const Logo = () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'GameHub';
    const appTagline = process.env.NEXT_PUBLIC_APP_TAGLINE || 'Stream • Play • Connect';

    return (
        <Link href="/">
            <div className="flex items-center gap-x-3 hover:scale-105 transition-transform duration-200">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-20 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-card to-card/90 rounded-full p-2 border-2 border-primary/20 shadow-lg">
                        <DynamicLogo 
                            size={32}
                            className="drop-shadow-sm transition-colors duration-300"
                        />
                    </div>
                </div>
                <div className={cn(
                    "hidden lg:block",
                    font.className
                )}>
                    <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                       {appName}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                        {appTagline}
                    </p>
                </div>
            </div>
        </Link>
    )
}