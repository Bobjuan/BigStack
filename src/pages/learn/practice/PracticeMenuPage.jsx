import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from './data/scenarios/index';

const ChevronIcon = ({ isOpen }) => (
    <svg 
        className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

const PracticeMenuPage = () => {
    const navigate = useNavigate();
    const [openCategory, setOpenCategory] = useState(null);
    const [openLevels, setOpenLevels] = useState({});
    // Add state for postflop open/closed
    const [isPostflopOpen, setIsPostflopOpen] = useState(false);

    const handleScenarioClick = (e, scenarioId) => {
        e.preventDefault();
        navigate(`/learn/practice/${scenarioId}`);
    };

    const toggleCategory = (categoryId) => {
        setOpenCategory(openCategory === categoryId ? null : categoryId);
    };

    const toggleLevel = (categoryId, difficulty) => {
        setOpenLevels(prev => ({
            ...prev,
            [`${categoryId}-${difficulty}`]: !prev[`${categoryId}-${difficulty}`]
        }));
    };

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">No practice scenarios available.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">
            <div className="practice-menu h-full w-full max-w-full flex flex-col">
                <h1 className="text-3xl font-bold mb-8 text-white px-8 pt-8 text-center">Practice Scenarios</h1>
                <div className="flex justify-center items-center w-full min-h-[60vh]">
                  <div className="space-y-4 px-8 pb-8 max-w-3xl w-full overflow-y-auto overflow-x-hidden">
                    {categories.map(category => {
                        if (!category || !category.scenarios) return null;
                        
                        const isCategoryOpen = openCategory === category.id;
                        
                        return (
                            <div key={category.id} className="bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden border border-gray-700 my-6 max-w-3xl w-full">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className={`w-full px-6 py-5 flex items-center justify-between text-white transition-colors ${
                                        isCategoryOpen ? 'bg-gray-700' : 'hover:bg-gray-750'
                                    }`}
                                >
                                    <div className="text-left w-full">
                                        <h2 className="text-2xl font-bold text-left">{category.title}</h2>
                                        <p className="text-gray-300 text-sm mt-1 text-left">{category.description}</p>
                                    </div>
                                    <ChevronIcon isOpen={isCategoryOpen} />
                                </button>
                                
                                {isCategoryOpen && (
                                    <div className="p-4 space-y-3">
                                        {category.scenarios.map((level) => {
                                            if (!level || !level.scenarios) return null;
                                            
                                            const isLevelOpen = openLevels[`${category.id}-${level.difficulty}`];
                                            
                                            return (
                                                <div key={level.difficulty} className="bg-gray-750 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => toggleLevel(category.id, level.difficulty)}
                                                        className={`w-full px-5 py-4 flex items-center justify-between text-white transition-colors ${
                                                            isLevelOpen ? 'bg-gray-700' : 'hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3">
                                                                <h3 className="text-lg font-bold">{level.title}</h3>
                                                                <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm font-medium">
                                                                    {level.difficulty}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-300 text-sm mt-1">{level.description}</p>
                                                        </div>
                                                        <ChevronIcon isOpen={isLevelOpen} />
                                                    </button>
                                                    
                                                    {isLevelOpen && (
                                                        <div className="p-3 space-y-2 bg-gray-800">
                                                            {level.scenarios.map(scenario => {
                                                                if (!scenario) return null;
                                                                
                                                                return (
                                                                    <button
                                                                        key={scenario.id}
                                                                        onClick={(e) => handleScenarioClick(e, scenario.numericId)}
                                                                        className="w-full text-left p-4 rounded-lg transition-all duration-200
                                                                            bg-gray-750 hover:bg-gray-700
                                                                            border border-gray-700 hover:border-gray-600
                                                                            transform hover:-translate-y-px hover:shadow-md"
                                                                    >
                                                                        <h4 className="font-semibold text-white text-lg">{scenario.title}</h4>
                                                                        <p className="text-sm text-gray-300 mt-1">{scenario.description}</p>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {/* Postflop Decisions Card */}
                    <div className="bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden border border-gray-700 my-26 max-w-3xl w-full">
                      <button
                        onClick={() => setIsPostflopOpen(v => !v)}
                        className={`w-full px-6 py-5 flex items-center justify-between text-white transition-colors ${isPostflopOpen ? 'bg-gray-700' : 'hover:bg-gray-750'}`}
                      >
                        <div className="text-left w-full">
                          <h2 className="text-2xl font-bold text-left">Postflop Decisions</h2>
                          <p className="text-gray-300 text-sm mt-1 text-left">Master postflop play with scenarios covering c-betting, turn/river play, and more. (Coming soon!)</p>
                        </div>
                        <ChevronIcon isOpen={isPostflopOpen} />
                      </button>
                      {isPostflopOpen && (
                        <div className="p-4 text-gray-400 text-center text-sm">No postflop scenarios available yet. Stay tuned!</div>
                      )}
                    </div>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeMenuPage; 