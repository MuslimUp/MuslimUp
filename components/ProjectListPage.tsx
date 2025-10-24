import React from 'react';
import { Project, Category } from '../types';
import ProjectCard from './ProjectCard';
import { PlusCircleIcon } from './icons';

interface ProjectListPageProps {
  projects: Project[];
  categories: Category[];
  onGoHome: () => void;
}

const ProjectListPage: React.FC<ProjectListPageProps> = ({ projects, categories, onGoHome }) => {
  const categoriesMap = React.useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white">Projets disponibles</h1>
          <p className="text-gray-400 mt-2">
            Trouvez la mission parfaite et proposez vos services aux clients.
          </p>
        </div>
        <button className="mt-6 md:mt-0 inline-flex items-center justify-center gap-x-2 h-12 px-8 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors">
          <PlusCircleIcon className="h-6 w-6" />
          Poster un projet
        </button>
      </div>
      <div className="space-y-6">
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              categoryName={categoriesMap[project.categoryId]}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-200">Aucun projet disponible</h2>
            <p className="text-gray-400 mt-2">Soyez le premier à poster un projet et à recevoir des offres de nos talents !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListPage;
