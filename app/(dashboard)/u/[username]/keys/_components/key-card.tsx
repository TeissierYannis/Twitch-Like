"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CopyButton } from "./copy-button";

export function KeyCard({ value }: { value: string | null }) {
    const [show, setShow] = useState(false);

    return (
        <div className="p-6 space-y-4">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Stream Key</h3>
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
                        <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-medium text-amber-600">Secret</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Keep this key private and secure. It's used to authenticate your streaming software.
                </p>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Input
                        value={value || ""}
                        disabled
                        placeholder="Stream Key"
                        type={show ? "text" : "password"}
                        className="font-mono text-sm"
                    />
                    <CopyButton value={value || ""} />
                </div>
                <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShow(!show)}
                    className="text-xs hover:bg-muted/50"
                >
                    {show ? "🙈 Hide" : "👁️ Show"}
                </Button>
            </div>
        </div>
    );
}