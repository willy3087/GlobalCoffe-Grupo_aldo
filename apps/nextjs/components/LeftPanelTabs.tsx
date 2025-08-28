'use client';

import React, { useState } from 'react';

interface LeftPanelTabsProps {
    children: React.ReactNode[];
}

const LeftPanelTabs: React.FC<LeftPanelTabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <div className="h-full flex flex-col">
            <div className="flex border-b border-gray-300">
                <button
                    className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === 0 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
                        }`}
                    onClick={() => setActiveTab(0)}
                >
                    Árvore
                </button>
                <button
                    className={`px-4 py-2 font-semibold focus:outline-none ${activeTab === 1 ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
                        }`}
                    onClick={() => setActiveTab(1)}
                >
                    Cards
                </button>
            </div>
            <div className="flex-grow overflow-auto">
                {children[activeTab]}
            </div>
        </div>
    );
};

export default LeftPanelTabs;
