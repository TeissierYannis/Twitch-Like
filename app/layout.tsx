import {type Metadata} from 'next'
import { Toaster } from "sonner";
import {Geist, Geist_Mono} from 'next/font/google'
import './globals.css'

import {ThemeProvider} from "@/components/theme-provider";
import {ClerkThemeWrapper} from "@/components/clerk-theme-wrapper";
import {SkipNavigation} from "@/components/accessibility/skip-navigation";
import {ErrorBoundaryProvider} from "@/components/error-boundary-provider";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: {
        default: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub',
        template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'GameHub'}`,
    },
    description: 'The ultimate streaming platform where creators connect with their audience. Stream, play, and build your community.',
    keywords: ['streaming', 'live', 'gaming', 'community', 'broadcast', 'twitch alternative'],
    authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub' }],
    creator: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub',
    publisher: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        title: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub',
        description: 'The ultimate streaming platform where creators connect with their audience.',
        siteName: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub',
    },
    twitter: {
        card: 'summary_large_image',
        title: process.env.NEXT_PUBLIC_APP_NAME || 'GameHub',
        description: 'The ultimate streaming platform where creators connect with their audience.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ErrorBoundaryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={true}
                storageKey={`${process.env.NEXT_PUBLIC_APP_NAME?.toLowerCase() || 'gamehub'}-theme`}
            >
                <ClerkThemeWrapper>
                    <SkipNavigation />
                    <Toaster
                        theme="system"
                        position="bottom-center"
                        richColors
                    />
                    <main id="main-content">
                        {children}
                    </main>
                </ClerkThemeWrapper>
            </ThemeProvider>
        </ErrorBoundaryProvider>
        </body>
        </html>
    )
}