import React from "react";
import { format } from "date-fns";

import { getBlockedUsers } from "@/lib/block-service";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function CommunityPage() {
    const blockedUsers = await getBlockedUsers();

    const formattedData = blockedUsers.map((block) => ({
        ...block,
        userId: block.blocked.id,
        imageUrl: block.blocked.imageUrl,
        username: block.blocked.username,
        createdAt: format(new Date(block.blocked.createdAt), "dd/MM/yyyy"),
    }));

    return (
        <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Community Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage blocked users and community moderation
                    </p>
                </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <DataTable columns={columns} data={formattedData} />
                </div>
            </div>
        </div>
    );
}