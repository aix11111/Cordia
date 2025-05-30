import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  category?: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">{question}</h3>
        {category && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
            {category}
          </span>
        )}
        <button
          className="text-gray-500 focus:outline-none"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-2 text-gray-600 prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatAnswer(answer) }} />
        </div>
      )}
    </div>
  );
};

// 简单的格式化函数，将换行符转换为<br/>标签
function formatAnswer(text: string): string {
  return text
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

export default FAQItem;
