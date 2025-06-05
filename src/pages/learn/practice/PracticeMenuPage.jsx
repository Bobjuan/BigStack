import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from './data/scenarios';

const PracticeMenuPage = () => {
    return (
        <div className="min-h-screen bg-gray-900">
            <div className="practice-menu p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-white">Practice Scenarios</h1>
                
                <div className="grid gap-6 md:grid-cols-2">
                    {categories.map(category => (
                        <div key={category.id} className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                            <h2 className="text-2xl font-bold mb-3 text-white">{category.title}</h2>
                            <p className="text-gray-300 mb-4">{category.description}</p>
                            
                            <div className="space-y-4">
                                {category.scenarios.flatMap(level =>
                                    (level?.scenarios || []).map(scenario => (
                                    <Link
                                        key={scenario.numericId || scenario.id}
                                        to={`/learn/practice/${scenario.numericId || scenario.id}`}
                                        className="block p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors bg-gray-800"
                                    >
                                        <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-white">{scenario.title}</h3>
                                            <p className="text-sm text-gray-400">{scenario.description}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
                                            {scenario.difficulty || level.difficulty}
                                        </span>
                                        </div>
                                    </Link>
                                    ))
                                )}
                                </div>


                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PracticeMenuPage; 