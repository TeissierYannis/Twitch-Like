"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UseStreamStatusOptions {
  username: string;
  initialIsLive: boolean;
  checkInterval?: number; // in milliseconds
}

export function useStreamStatus({
  username,
  initialIsLive,
  checkInterval = 30000, // Check every 30 seconds by default
}: UseStreamStatusOptions) {
  const router = useRouter();
  const [isLive, setIsLive] = useState(initialIsLive);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    // Don't check if stream is not live initially
    if (!initialIsLive) {
      return;
    }

    const checkStreamStatus = async () => {
      try {
        const response = await fetch("/api/streams/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          const data = await response.json();

          // If status changed from live to offline
          if (isLive && !data.isLive) {
            setIsLive(false);
            // Refresh the page to show offline state
            router.refresh();
          }

          setLastCheck(new Date());
        }
      } catch (error) {
        console.error("Failed to check stream status:", error);
      }
    };

    // Initial check after 10 seconds
    const initialTimer = setTimeout(checkStreamStatus, 10000);

    // Then check at regular intervals
    const interval = setInterval(checkStreamStatus, checkInterval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [username, initialIsLive, isLive, checkInterval, router]);

  return {
    isLive,
    lastCheck,
  };
}
