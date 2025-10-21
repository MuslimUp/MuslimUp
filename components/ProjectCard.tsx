import React from 'react';
import { Project } from '../types';
import { CurrencyDollarIcon, DocumentTextIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  categoryName: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, categoryName }) => {
  return (
    <div className="group flex flex-col md:flex-row items-start justify-between gap-6 p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-teal-500/50 hover:bg-gray-900 transition-all duration-300">
      <div className="flex-1">
        <div className="flex items-center gap-x-4 text-xs mb-3">
          <span className="relative z-10 rounded-full bg-teal-500/10 px-3 py-1 font-medium text-teal-400">
            {categoryName}
          </span>
          <time dateTime={project.postedAt} className="text-gray-400">
            {project.postedAt}
          </time>
        </div>
        <h3 className="text-xl font-semibold leading-tight text-white group-hover:text-teal-400 transition-colors">
          <a href="#">
            <span className="absolute inset-0" />
            {project.title}
          </a>
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-300 line-clamp-2">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-x-1.5">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span className="font-semibold text-white">{project.budget.min}€ - {project.budget.max}€</span>
          </div>
          <div className="flex items-center gap-x-1.5">
            <DocumentTextIcon className="h-5 w-5" />
            <span className="font-semibold text-white">{project.proposalsCount} Propositions</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 mt-4 md:mt-0">
        <button className="h-11 px-6 bg-gray-700/50 text-white font-semibold rounded-lg border border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-white">
          Faire une offre
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
