import {Logo} from "@/app/(auth)/_components/logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-8 p-6">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center">
                        <Logo />
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl shadow-primary/10 p-8">
                        {children}
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;