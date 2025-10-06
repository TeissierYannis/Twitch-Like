import {Input} from "@/components/ui/input";
import {CopyButton} from "@/app/(dashboard)/u/[username]/keys/_components/copy-button";

interface UrlCardProps {
    value: string | null;
}

export const UrlCard = ({
                            value
                        }: UrlCardProps) => {
    return (
        <div className="p-6 space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Server URL</h3>
                    <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="text-xs font-medium text-blue-600">Public</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Use this URL to configure your streaming software (OBS, Streamlabs, etc.).
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Input
                    value={value || ""}
                    disabled
                    placeholder="Server URL"
                    className="font-mono text-sm"
                />
                <CopyButton value={value || ""} />
            </div>
        </div>
    )
}