import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { experience } from '../data/experience';

const experienceCmd: CommandHandler = () => {
  return (
    <div className="flex flex-col space-y-6 mt-4">
      {experience.map((job, index) => (
        <div key={index} className="flex flex-col">
          <div className="border-b border-gray-600 pb-1 mb-2">
            <span className="font-bold text-lg text-yellow-500">{job.period}</span>
          </div>
          <div className="text-xl font-bold mb-1">
            {job.title} <span className="text-gray-400">@ {job.company}</span>
          </div>
          <ul className="list-disc pl-5">
            {job.highlights.map((highlight, i) => (
              <li key={i} className="mb-1 text-gray-300">{highlight}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

registerCommand('experience', 'See my work history', experienceCmd);
