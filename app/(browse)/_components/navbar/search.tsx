"use client";

import qs from 'query-string';
import {useState} from 'react';
import {SearchIcon, X} from "lucide-react";
import {useRouter} from 'next/navigation';

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export const Search = () => {

    const router = useRouter();
    const [value, setValue] = useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!value) {
            return;
        }

        const url = qs.stringifyUrl({
            url: "/search",
            query: {term: value}
        }, {
            skipEmptyString: true
        });

        router.push(url);
    }

    const onClear = () => {
        setValue("");
    }

    return (
        <form
            onSubmit={onSubmit}
            className="relative w-full max-w-lg lg:w-[400px] flex items-center"
        >
            <div className="relative w-full">
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search streamers, games..."
                    className="rounded-r-none bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 pl-4 pr-10"
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute top-1/2 -translate-y-1/2 right-12 p-1 hover:bg-muted/50 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </div>
            <Button
                type="submit"
                size="sm"
                variant="default"
                className="rounded-l-none bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-0 px-4"
            >
                <SearchIcon className="h-4 w-4 text-primary-foreground" />
            </Button>
        </form>
    );
}