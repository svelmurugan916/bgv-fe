import React, { forwardRef, useState, useEffect, useRef, useMemo, useLayoutEffect } from "react"; // Added useLayoutEffect
import { getTaskIcon } from "../../utils/icon-utils.js";

const getCategoryName = (taskName) => {
    switch (taskName) {
        case 'address': return 'Address';
        case 'education': return 'Education';
        case 'employment': return 'Employment';
        case 'identity': return 'Identity';
        case 'reference': return 'References';
        case 'database': return 'Database';
        case 'criminal': return 'Criminal';
        default: return taskName;
    }
};

const MAX_TAB_WIDTH = 180;
const MIN_TAB_WIDTH = 80;

export const CandidateChecksTab = ({ caseDetails, tabsRef, activeTab, setActiveTab, consolidatedData }) => {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 }); // Internal state for indicator

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setContainerWidth(entry.target.offsetWidth);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
            setContainerWidth(containerRef.current.offsetWidth);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
            resizeObserver.disconnect();
        };
    }, []);

    const dynamicTabWidth = useMemo(() => {
        const tabCount = (caseDetails?.checks.length || 0) + 1;
        if (containerWidth > 0 && tabCount > 0) {
            const totalGapWidth = (tabCount > 1) ? (tabCount - 1) * 8 : 0;
            const availableWidthForTabs = containerWidth - totalGapWidth;
            const idealWidth = availableWidthForTabs / tabCount;

            return Math.min(MAX_TAB_WIDTH, Math.max(MIN_TAB_WIDTH, idealWidth));
        }
        return null;
    }, [containerWidth, caseDetails?.checks.length]);

    useLayoutEffect(() => {
        if (tabsRef.current && activeTab) {
            const activeTabElement = tabsRef.current[activeTab];
            if (activeTabElement) {
                setIndicatorStyle({
                    left: activeTabElement.offsetLeft,
                    width: activeTabElement.offsetWidth
                });
            }
        }
    }, [activeTab, tabsRef, dynamicTabWidth]);

    return (
        <div className="relative border-b border-slate-100">
            <div
                ref={containerRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar relative"
            >
                <div
                    className="absolute bottom-0 h-0.5 bg-[#5D4591] transition-all duration-300 ease-out z-10 rounded-full"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width
                    }}
                />

                {caseDetails?.checks.map((check) => (
                    <TabItem
                        ref={el => tabsRef.current[check.taskId] = el}
                        key={check.taskId}
                        label={check.displayName}
                        taskName={check?.taskName}
                        status={check.status}
                        active={activeTab === check.taskId}
                        onClick={() => setActiveTab(check.taskId)}
                        candidateStatus={consolidatedData?.status}
                        dynamicWidth={dynamicTabWidth}
                    />
                ))}
                <TabItem
                    ref={el => tabsRef.current['timeline'] = el}
                    key={'timeline'}
                    label={"Timeline"}
                    taskName={'timeline'}
                    status={''}
                    active={activeTab === 'timeline'}
                    onClick={() => setActiveTab('timeline')}
                    candidateStatus={''}
                    dynamicWidth={dynamicTabWidth}
                />
            </div>
        </div>
    );
};

const TabItem = forwardRef(({ label, active, status, onClick, candidateStatus, taskName, dynamicWidth }, ref) => {
    const getStatusColorClass = () => {
        if (candidateStatus === 'STOP_CASE' && !['CLEARED', 'FAILED', 'UNABLE_TO_VERIFY'].includes(status))
            return 'text-slate-300';
        switch (status) {
            case 'CLEARED': return 'text-emerald-500';
            case 'INSUFFICIENCY': return 'text-orange-500';
            case 'FAILED': return 'text-red-500';
            case 'NEEDS_REVIEW': return 'text-violet-500';
            case 'IN_PROGRESS': return 'text-blue-500';
            case 'UNABLE_TO_VERIFY': return 'text-amber-400';
            default: return 'text-[#5D4591]';
        }
    };

    const IconComponent = getTaskIcon(taskName || '');
    const tooltipText = `${getCategoryName(taskName)}${label ? ': ' + label : ''}`;

    return (
        <button
            ref={ref}
            onClick={onClick}
            className={`group relative flex flex-shrink-0 items-center justify-center pb-4 pt-2 transition-all cursor-pointer whitespace-nowrap`}
            style={{
                width: dynamicWidth ? `${dynamicWidth}px` : 'auto',
                maxWidth: `${MAX_TAB_WIDTH}px`,
                minWidth: `${MIN_TAB_WIDTH}px`
            }}
            title={tooltipText}
        >
            <div className={`flex items-center gap-1 w-full px-2 transition-all duration-300 ${active ? 'scale-105' : 'opacity-70 group-hover:opacity-100'}`}>
                {IconComponent && (
                    <div className="relative flex-shrink-0 flex items-center justify-center">
                        {['IN_PROGRESS', 'INSUFFICIENCY', 'NEEDS_REVIEW'].includes(status) && (candidateStatus !== 'STOP_CASE') && (
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${getStatusColorClass()}`}
                                  style={{ width: '16px', height: '16px' }} // Ensure ping is sized correctly around a 16px icon
                            ></span>
                        )}
                        <IconComponent size={16} className={getStatusColorClass()} />
                    </div>
                )}
                <span className={`text-[13px] capitalize tracking-tight transition-colors flex-grow
                                  ${active ? 'text-[#5D4591] font-bold' : 'font-semibold text-slate-500'}
                                  overflow-hidden whitespace-nowrap text-ellipsis`}>
                    {label || taskName}
                </span>
            </div>
        </button>
    );
});

export default CandidateChecksTab;
