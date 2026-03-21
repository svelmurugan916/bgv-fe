import React from 'react';

// --- Skeleton for a single timeline event card ---
const TimelineEventCardSkeleton = ({ layoutType }) => (
    <div className={`relative p-6 rounded-2xl shadow-lg w-full h-40 bg-gray-100 animate-pulse`}>
        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            <div className="w-40 h-6 bg-gray-200 rounded-md"></div>
        </div>
        {/* Description */}
        <div className="w-3/4 h-4 bg-gray-200 rounded-md mb-1"></div>
        {/* Reason (optional placeholder) */}
        <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-1"></div>
        {/* Date/Time */}
        <div className="w-1/3 h-4 bg-gray-200 rounded-md"></div>
        {/* Duration */}
        <div className="w-2/3 h-4 bg-gray-200 rounded-md mt-2"></div>

        {/* Triangle pointer placeholder (optional, can be omitted for simplicity in skeleton) */}
        <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent
                        ${layoutType === 'left' ? `right-[-15px] border-l-8 border-l-gray-100` : `left-[-15px] border-r-8 border-r-gray-100`}`}></div>
    </div>
);

// --- Skeleton for a single timeline date block ---
const TimelineDateBlockSkeleton = () => (
    <div className="flex-shrink-0 text-center bg-gray-100 p-3 rounded-xl border border-gray-200 w-24 h-24 shadow-sm z-10 animate-pulse">
        <div className="w-3/4 h-4 bg-gray-200 rounded-md mx-auto mb-1"></div>
        <div className="w-1/2 h-8 bg-gray-200 rounded-md mx-auto my-1"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded-md mx-auto"></div>
    </div>
);

// --- Main TimelineSkeleton component ---
const TimelineSkeleton = () => {
    return (
        <div className="p-8 bg-white min-h-screen font-sans animate-pulse">
            <div className="mb-8">
                <div className="flex items-center justify-between gap-3">
                    {/* Title and Subtitle Group Skeleton */}
                    <div>
                        <div className="w-64 h-8 bg-gray-200 rounded-md"></div>
                        <div className="w-96 h-5 bg-gray-200 rounded-md mt-2"></div>
                    </div>

                    {/* Overall Case Duration Skeleton */}
                    {/*<div className="w-48 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>*/}
                </div>

                {/* Check-wise TAT Summaries Skeleton */}
                <div className="mt-6">
                    <div className="w-48 h-7 bg-gray-200 rounded-md mb-3"></div>
                    <div className="flex flex-wrap gap-3">
                        {[...Array(6)].map((_, i) => ( // Show placeholders for a few buttons
                            <div key={i} className="w-32 h-9 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto">
                {/* Header Section Skeleton */}


                {/* Timeline Container Skeleton */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 z-0"></div>

                    {[...Array(3)].map((_, index) => ( // Show placeholders for 3 timeline events
                        <div
                            key={index}
                            className="relative mb-16 grid grid-cols-[1fr_auto_1fr] items-center"
                        >
                            {/* Left Side Content Skeleton */}
                            <div className="col-start-1 col-end-2 flex justify-end pr-10">
                                {index % 2 === 0 && <TimelineEventCardSkeleton layoutType="left" />}
                            </div>

                            {/* Timeline Dot (Center Column) */}
                            <div className="col-start-2 col-end-3 relative z-10 w-4 h-4 rounded-full bg-gray-300 border-2 border-white shadow-sm flex-shrink-0"></div>

                            {/* Right Side Content Skeleton */}
                            <div className="col-start-3 col-end-4 flex justify-start pl-10">
                                {index % 2 !== 0 && <TimelineEventCardSkeleton layoutType="right" />}
                            </div>

                            {/* Date Block Skeleton */}
                            <div className={`absolute top-1/2 -translate-y-1/2 z-10 flex-shrink-0
                                            ${index % 2 === 0 ? 'left-[calc(50%+40px)]' : 'right-[calc(50%+40px)]'}`}>
                                <TimelineDateBlockSkeleton />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineSkeleton;
