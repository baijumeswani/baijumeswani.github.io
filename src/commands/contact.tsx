import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { useState } from 'react';

const ContactDisplay = () => {
    const [copied, setCopied] = useState(false);
    const emailUser = 'baijumeswani';
    const emailDomain = 'gmail.com';
    const email = `${emailUser}@${emailDomain}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <span className="mr-2">📧 Email:</span>
            <a href={`mailto:${email}`} className="text-blue-400 hover:underline mr-4">{email}</a>
            <button onClick={copyToClipboard} className="text-sm text-gray-500 hover:text-gray-300">
                {copied ? '✅ copied' : '[click to copy]'}
            </button>
        </div>
    );
}

const contact: CommandHandler = () => {
    return <ContactDisplay />;
};

registerCommand('contact', 'Display my contact information', contact);
