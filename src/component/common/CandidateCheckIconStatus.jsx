import React, {useMemo} from "react";
import CheckIcon from "./CheckIcon.jsx";

const CandidateCheckIconStatus = ({checks = [], candidateStatus}) => {
    const processedChecks = useMemo(() => {
        if(checks && checks.length > 0) {
            const grouped = checks?.reduce((acc, check) => {
                let category = check.taskName.toUpperCase();
                if (category.includes('ADDRESS')) category = 'ADDRESS';
                else if (category.includes('IDENTITY') || category.includes('ID ')) category = 'IDENTITY';
                else if (category.includes('EDUCATION')) category = 'EDUCATION';
                else if (category.includes('EMPLOYMENT') || category.includes('EXPERIENCE')) category = 'EMPLOYMENT';
                else if (category.includes('CRIMINAL')) category = 'CRIMINAL';
                else if (category.includes('REFERENCE')) category = 'REFERENCE';
                else if (category.includes('DATABASE') || category.includes('DB ')) category = 'DATABASE';

                if (!acc[category]) acc[category] = [];
                acc[category].push(check);
                return acc;
            }, {});

            return grouped ? Object.keys(grouped).map(taskName => {
                const checks = grouped[taskName];
                const hasFailed = checks.some(c => c.status.toLowerCase().includes('failed'));
                const hasInsufficiency = checks.some(c => c.status.toLowerCase().includes('insufficiency'));
                const hasUnable = checks.some(c => c.status.toLowerCase().includes('unable_to_verify'));
                const hasInProgress = checks.some(c =>
                    c.status.toLowerCase() === 'in_progress' || c.status.toLowerCase() === 'needs_review'
                );
                const allUnassigned = checks.every(c => !c.assignedToUserId);
                const isAllCompleted = checks.every(c => ['cleared', 'failed', 'unableto_verify'].includes(c.status.toLowerCase()));

                let finalStatus = 'cleared';

                if(isAllCompleted) {
                    if (hasUnable) finalStatus = 'unableto_verify';
                    else if (hasFailed) finalStatus = 'failed'
                } else if(candidateStatus === 'STOP_CASE') {
                    finalStatus = 'stop_case';
                } else {
                    if (allUnassigned && hasInProgress) finalStatus = 'unassigned'
                    else if (hasInProgress) finalStatus = 'inprogress'
                    else if (hasInsufficiency) finalStatus = 'insufficiency';
                    else if (hasUnable) finalStatus = 'unableto_verify';
                    else if (hasFailed) finalStatus = 'failed';
                }

                return {
                    taskName: taskName,
                    status: finalStatus
                };
            }) : [];
        }
        return null;
    }, [candidateStatus, checks]);

    return (
        <>
            {processedChecks?.map((check, idx) => (
                <CheckIcon key={idx} status={check.status} label={check.taskName} />
            ))}
        </>
    )
}

export default CandidateCheckIconStatus