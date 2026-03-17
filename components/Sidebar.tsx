import React, { useState } from 'react';
import { Module, Lesson } from '../types';
import { ChevronDown, ChevronRight, PlayCircle, CheckCircle, Lock, X, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  modules: Module[];
  currentLessonId: string | null;
  onSelectLesson: (lesson: Lesson | null) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ modules, currentLessonId, onSelectLesson, isOpen, onCloseMobile }) => {
  // State to track expanded modules. Default to all expanded or first one.
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-80 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-full transition-colors duration-500
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-brand-500 rounded-full"></span>
                Atelier Kids
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
                Área da Costureira
              </p>
            </div>
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {/* Overview Link */}
            <button
              onClick={() => {
                onSelectLesson(null);
                if (window.innerWidth < 1024) onCloseMobile();
              }}
              className={`
                w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 group mb-2
                ${currentLessonId === null 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                  : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800/50'}
              `}
            >
              <LayoutDashboard size={20} />
              <span className="font-bold text-sm">Visão Geral</span>
            </button>

            <div className="h-px bg-zinc-200 dark:bg-zinc-800/50 mx-2 my-4" />

            {modules.map((module, index) => {
              const isExpanded = !!expandedModules[module.id];
              const isActiveModule = module.lessons.some(l => l.id === currentLessonId);

              return (
                <div key={module.id} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50">
                  {/* Module Header */}
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isActiveModule ? 'bg-zinc-100 dark:bg-zinc-800/50' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/30'}`}
                  >
                    <div>
                      <span className="text-xs text-brand-600 dark:text-brand-500 font-bold uppercase tracking-wide">
                        {module.label || `Módulo ${index + 1}`}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mt-1">{module.title}</h3>
                    </div>
                    {isExpanded ? <ChevronDown size={18} className="text-zinc-400 dark:text-zinc-500" /> : <ChevronRight size={18} className="text-zinc-400 dark:text-zinc-500" />}
                  </button>

                  {/* Lessons List */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-2 pb-2 pt-4 space-y-1">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === currentLessonId;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              onSelectLesson(lesson);
                              if (window.innerWidth < 1024) onCloseMobile();
                            }}
                            className={`
                              w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group
                              ${isActive 
                                ? 'bg-brand-500/10 border border-brand-500/20' 
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent'}
                            `}
                          >
                            <div className={`
                              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                              ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700'}
                            `}>
                              {isActive ? (
                                <PlayCircle size={16} fill="currentColor" />
                              ) : lesson.locked ? (
                                <Lock size={14} />
                              ) : (
                                <span className="text-xs font-bold">{module.lessons.indexOf(lesson) + 1}</span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-700 dark:text-brand-100' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                                {lesson.title}
                              </p>
                              {lesson.duration && lesson.duration !== '00:00' && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">{lesson.duration}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};