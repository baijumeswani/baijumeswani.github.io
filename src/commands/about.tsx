import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { about } from '../data/about';

export const AboutDisplay = () => {
  const { text, imageUrl } = about;

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start mt-4 mb-4">
      {imageUrl && (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
            <img 
              src={imageUrl} 
              alt="Baiju Meswani" 
              className="relative w-32 h-32 rounded-full border-2 border-black object-cover shrink-0 shadow-lg transform transition duration-500 hover:scale-105"
            />
        </div>
      )}
      <div className="whitespace-pre-wrap flex-1 leading-relaxed text-gray-300">
        {renderTextWithLinks(text)}
      </div>
    </div>
  );
};

const aboutCmd: CommandHandler = () => {
  return <AboutDisplay />;
};

registerCommand('about', 'Learn more about me', aboutCmd);
