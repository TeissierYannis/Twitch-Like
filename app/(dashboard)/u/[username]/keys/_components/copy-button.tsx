"use client";

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {CheckIcon, Copy} from "lucide-react";

interface CopyClientProps {
    value?: string;
}

export const CopyButton = ({value}: CopyClientProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = () => {
        if (!value) return;

        setIsCopied(true);
        navigator.clipboard.writeText(value);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }

    const Icon = isCopied ? CheckIcon : Copy;

    return (
        <Button
            onClick={onCopy}
            disabled={!value || isCopied}
            variant="ghost"
            size="sm"
        >
            <Icon
                className="h-4 w-4"
            />
        </Button>
    )
}