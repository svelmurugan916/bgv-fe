import React from 'react';

const PageSection = ({ children, forceNewPage = false }) => {
    return (
        <section
            style={{
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                // If forceNewPage is true, it starts this section on a brand new page
                breakBefore: forceNewPage ? 'page' : 'auto'
            }}
            className="mb-8"
        >
            {children}
        </section>
    );
};

export default PageSection;
