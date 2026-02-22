import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { projects } from '../data/projects';

const projectsCmd: CommandHandler = () => {
  return (
    <div className="flex flex-col space-y-4 mt-2">
      {projects.map((project, index) => (
        <div key={index} className="border border-gray-600 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <span className="text-xl font-bold mr-2">📂 {project.name}</span>
          </div>
          <p className="mb-2 text-gray-400">{project.description}</p>
          <div className="flex space-x-4">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Repo [↗]
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Demo [↗]
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

registerCommand('projects', 'View my projects and demos', projectsCmd);
