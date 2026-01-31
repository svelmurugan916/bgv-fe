import React, { useEffect, useRef } from 'react';
import { Check, User, FileText, Book, Briefcase, Users, Eye, MapPin } from 'lucide-react';

const Stepper = ({ activeStep, steps }) => {
    const scrollContainerRef = useRef(null);
    const stepRefs = useRef([]);

    const icons = [
        <User size={16} />, <MapPin size={16} />, <FileText size={16} />, <Book size={16} />,
        <Briefcase size={16} />, <Users size={16} />, <Eye size={16} />
    ];

    useEffect(() => {
        const activeStepIndex = activeStep - 1;
        const activeElement = stepRefs.current[activeStepIndex];
        if (activeElement && scrollContainerRef.current) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeStep]);

    return (
        /* Reduced padding on mobile (py-4) vs laptop (p-10) */
        <div className="w-full lg:w-80 bg-white border-b lg:border-r border-slate-100 shrink-0 z-20">
            <div
                ref={scrollContainerRef}
                className="flex lg:flex-col overflow-x-auto lg:overflow-x-hidden no-scrollbar py-4 px-4 lg:p-10"
            >
                {steps.map((step, index) => {
                    const isActive = activeStep === step.id;
                    const isCompleted = activeStep > step.id;
                    const isLast = index === steps.length - 1;

                    return (
                        <div
                            key={step.id}
                            ref={el => stepRefs.current[index] = el}
                            className={`relative flex flex-col lg:flex-row items-center lg:items-start shrink-0 
                ${!isLast ? 'mb-0 lg:mb-12 mr-10 lg:mr-0' : 'mr-0'} 
              `}
                        >
                            {/* CONNECTING LINE - Adjusted top position for smaller mobile circles */}
                            {!isLast && (
                                <div
                                    className={`absolute transition-all duration-500 ease-in-out -z-10
                    left-1/2 top-4.5 w-[calc(100%+2.5rem)] h-[2px] 
                    lg:left-[23px] lg:top-12 lg:w-[2px] lg:h-12
                    ${isCompleted ? 'bg-[#5D4591]' : 'bg-slate-100'}
                  `}
                                />
                            )}

                            {/* STEP CIRCLE - Reduced size on mobile (w-9 h-9) */}
                            <div className={`
                w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 shrink-0
                ${isActive
                                ? 'bg-[#5D4591] text-white shadow-md scale-110'
                                : isCompleted
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-50 text-slate-300 border border-slate-100'}
              `}>
                                {isCompleted ? <Check size={18} strokeWidth={3} /> : icons[index]}
                            </div>

                            {/* LABELS - Optimized for vertical space */}
                            <div className="mt-2 lg:mt-0 lg:ml-6 text-center lg:text-left">
                                {/* Hide "Step X" text on mobile entirely */}
                                <p className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Step {index + 1}
                                </p>
                                {/* Smaller font on mobile (text-[10px]) */}
                                <p className={`text-[10px] lg:text-sm font-bold whitespace-nowrap transition-colors duration-300 
                  ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {step.fullTitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
