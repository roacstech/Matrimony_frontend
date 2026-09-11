import React, { useState } from 'react';

const books = [
  {
    id: 1,
    title: "யூத் பளஞ்சிகா - Sep 2026",
    date: "September 2026",
    link: "https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/YB+September+Book.pdf"
  },
  {
    id: 2,
    title: "யூத் பளஞ்சிகா - Aug 2026",
    date: "August 2026",
    link: "https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/August+2026+YB+PDF.pdf"
  }
  
  // {
  //   id: 3,
  //   title: "June 2026 - யூத் பளஞ்சிகா",
  //   date: "June 2026",
  //   link: "https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/August+2026+YB+PDF.pdf"
  // },
  // {
  //   id: 4,
  //   title: "May 2026 - யூத் பளஞ்சிகா",
  //   date: "May 2026",
  //   link: "https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/August+2026+YB+PDF.pdf"
  // },
  // {
  //   id: 5,
  //   title: "April 2026 - யூத் பளஞ்சிகா",
  //   date: "April 2026",
  //   link: "https://roacs-bucket.s3.ap-south-1.amazonaws.com/matrimony-profiles/August+2026+YB+PDF.pdf"
  // }
];

const PreviousBooks = () => {
  const [showAll, setShowAll] = useState(false);

  const displayBooks = showAll ? books : books.slice(0, 3);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-[320px]">

      {/* Header - Dark Blue */}
      <div className="bg-[#0b1238] flex items-center justify-center px-6 py-4">
        <h3 className="text-[17px] font-bold text-white tracking-wide">யூத் பளஞ்சிகா</h3>
      </div>

      {/* Content - Light Blue/Gray */}
      <div className="bg-[#f3f7fb] flex-1 overflow-y-auto px-5 py-2 thin-scrollbar">
        <div className="flex flex-col">
          {displayBooks.map((book) => (
            <div
              key={book.id}
              className="py-4 border-b border-dashed border-gray-300 last:border-0"
            >
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <h4 className="text-[15px] font-bold text-[#475569] group-hover:text-blue-700 transition-colors leading-snug">
                    {book.title}
                  </h4>
                  <span className="inline-flex items-center rounded-sm bg-red-50 px-1 py-0 text-[9px] font-bold text-[#ff6b6b] border border-[#ff6b6b]/30 shrink-0 uppercase tracking-wider">
                    PDF
                  </span>
                </div>
                <p className="text-[12px] text-[#94a3b8] font-medium">
                  Posted on : {book.date}
                </p>
              </a>
            </div>
          ))}

          {books.length === 0 && (
            <div className="text-center py-8 text-[#8ba2b8] font-medium">
              No books available yet.
            </div>
          )}
        </div>
      </div>

      {/* Footer / View All */}
      {books.length > 3 && (
        <div className="bg-[#f3f7fb] border-t border-dashed border-gray-300 px-5 py-3 flex justify-between items-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[13px] font-semibold text-[#475569] hover:text-[#0b1238] transition-colors cursor-pointer"
          >
            {showAll ? 'View Less' : 'View All'}
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .thin-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .thin-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .thin-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .thin-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}} />
    </div>
  );
};

export default PreviousBooks;
