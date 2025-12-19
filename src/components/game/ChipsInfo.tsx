'use client';

import React from 'react';

interface ChipsInfoProps {
    pot: number;
}

export const ChipsInfo: React.FC<ChipsInfoProps> = ({ pot }) => {
    return (
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg p-4 mb-6">
            <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                <div className="text-purple-200 text-sm mb-1">Общий банк</div>
                <div className="text-2xl font-bold text-purple-100 flex items-center justify-center">
                    <span>{pot}</span>
                    <span className="ml-2">💰</span>
                </div>
            </div>
        </div>
    );
}; 