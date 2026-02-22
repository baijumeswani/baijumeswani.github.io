import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';

const resumeCmd: CommandHandler = () => {
  const resumeUrl = '/resume.pdf';

  return (
    <div>
      <span className="mr-2">📄 Resume:</span>
      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mr-4">
        {resumeUrl} [↗ open]
      </a>
      <a href={resumeUrl} download className="text-blue-400 hover:underline">
        [⬇ download]
      </a>
    </div>
  );
};

registerCommand('resume', 'Open my resume', resumeCmd);
