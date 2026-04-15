import React from 'react';

const FooterColumn = ({ title, links }) => (
    <div className="flex flex-col gap-4">
        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-2">
            {title}
        </h4>
        <ul className="flex flex-col gap-3">
            {links.map((link, index) => (
                <li key={index}>
                    <a
                        href={link.href}
                        className="text-[13px] font-medium text-slate-400 hover:text-[#A78BFA] transition-colors duration-200 flex items-center gap-2 group"
                    >
                        {link.label}
                        {link.isExternal && <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export default FooterColumn;
