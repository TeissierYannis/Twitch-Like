"use client";

import {
    Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ComponentRef, useRef, useState, useTransition } from "react";
import { createIngress } from "@/actions/ingress";
import { toast } from "sonner";

/** Mirror des valeurs SDK, mais local (safe côté client) */
const IngressInputLocal = {
    RTMP_INPUT: 0,
    WHIP_INPUT: 1,
} as const;

type IngressType = string; // on stocke comme string pour Select

const RTMP = String(IngressInputLocal.RTMP_INPUT);
const WHIP = String(IngressInputLocal.WHIP_INPUT);

export const ConnectModal = () => {
    const closeRef = useRef<ComponentRef<"button">>(null);
    const [isPending, startTransition] = useTransition();
    const [ingressType, setIngressType] = useState<string>(RTMP);

    const onSubmit = () => {
        startTransition(() => {
            // Convertir la valeur string en type "RTMP" | "WHIP"
            const type = ingressType === WHIP ? "WHIP" : "RTMP";
            createIngress(type)
                .then(() => {
                    toast.success("Ingress created successfully.");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Error something went wrong."));
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="primary">Generate connection</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate connection</DialogTitle>
                </DialogHeader>

                <Select
                    disabled={isPending}
                    value={ingressType}
                    onValueChange={(value) => setIngressType(value as IngressType)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Ingress type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={RTMP}>RTMP</SelectItem>
                        <SelectItem value={WHIP}>WHIP</SelectItem>
                    </SelectContent>
                </Select>

                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning!</AlertTitle>
                    <AlertDescription>
                        This action will reset all active streams using the current connection
                    </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                    <DialogClose ref={closeRef} asChild>
                        <Button variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={onSubmit} variant="primary">
                        Generate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
