import React from 'react';
import Link from 'next/link';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  description,
  category,
  language,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">语言: {language}</span>
          <Link 
            href={`/dashboard/templates/${id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            查看详情 →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
