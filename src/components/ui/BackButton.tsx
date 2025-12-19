import React from 'react';

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className="absolute top-4 left-4 flex items-center gap-2 
                       px-5 py-2.5 rounded-xl 
                       bg-white/90 backdrop-blur-sm
                       text-gray-700 hover:text-gray-900
                       shadow-lg hover:shadow-xl
                       transition-all duration-300
                       group"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor"
                className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-x-1"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
                />
            </svg>
            <span className="font-medium">Назад</span>
        </button>
    );
}; 