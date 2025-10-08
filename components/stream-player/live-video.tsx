"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useEventListener } from "usehooks-ts";

import { FullscreenControl } from "./fullscreen-control";
import { VolumeControl } from "./volume-control";
import { TheaterControl } from "./theater-control";

interface LiveVideoProps {
    username: string;
}

export function LiveVideo({ username }: LiveVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [volume, setVolume] = useState(0);

    const onVolumeChange = (value: number) => {
        setVolume(+value);
        if (videoRef?.current) {
            videoRef.current.muted = value === 0;
            videoRef.current.volume = +value * 0.01;
        }
    };

    const toggleMute = () => {
        const isMuted = volume === 0;
        setVolume(isMuted ? 50 : 0);

        if (videoRef?.current) {
            videoRef.current.muted = !isMuted;
            videoRef.current.volume = isMuted ? 0.5 : 0;
        }
    };

    useEffect(() => {
        onVolumeChange(0);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const hlsUrl = `${process.env.NEXT_PUBLIC_MEDIAMTX_HLS_URL}/app/live/${username}/index.m3u8`;

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hlsRef.current = hls;

            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch((e) => console.error("Error playing video:", e));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("HLS fatal error:", data);
                }
            });

            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Support natif HLS (Safari)
            video.src = hlsUrl;
            video.addEventListener("loadedmetadata", () => {
                video.play().catch((e) => console.error("Error playing video:", e));
            });
        }
    }, [username]);

    const toggleFullscreen = () => {
        if (isFullscreen) {
            document.exitFullscreen();
        } else if (wrapperRef?.current) {
            wrapperRef.current.requestFullscreen();
        }
    };

    const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = document.fullscreenElement !== null;
        setIsFullscreen(isCurrentlyFullscreen);
    };

    useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef as any);

    return (
        <div ref={wrapperRef} className="relative h-full flex">
            <video
                ref={videoRef}
                width="100%"
                controls={false}
                playsInline
                className="object-contain"
            />
            <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
                <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
                    <VolumeControl
                        onChange={onVolumeChange}
                        value={volume}
                        onToggle={toggleMute}
                    />
                    <div className="flex items-center gap-2">
                        <TheaterControl />
                        <FullscreenControl
                            isFullscreen={isFullscreen}
                            onToggle={toggleFullscreen}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}