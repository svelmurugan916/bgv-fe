const AnnexurePage = ({ id, title, image }) => (
    <div id={`annexure-${id}`} className="w-[210mm] min-h-[297mm] bg-white p-12 mx-auto mb-10 shadow-lg print:shadow-none">
        <h3 className="border border-slate-800 p-2 text-center font-bold text-[#00A38D] mb-8">
            {title} Annexure
        </h3>
        <div className="border-2 border-dashed border-slate-200 p-4 bg-slate-50 rounded-xl flex items-center justify-center min-h-[600px]">
            {/* The actual uploaded document image */}
            <img src={image} alt={title} className="max-w-full max-h-[800px] object-contain shadow-2xl" />
        </div>
        <div className="mt-8 text-[10px] text-slate-400 flex justify-between">
            <span>www.speedcheck.ai</span>
            <span>Confidential</span>
        </div>
    </div>
);


export default AnnexurePage;