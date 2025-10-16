import React, { useState } from 'react';

// Define the interface for the component's props
interface SdpTextareaProps {
  sdp: string;
  onSdpChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label: string;
  buttonText?: string;
  onButtonClick?: () => void;
  instructions: string;
  // FIX: hasContent is now optional
  hasContent?: boolean;
}

const SdpTextarea: React.FC<SdpTextareaProps> = ({
  sdp,
  onSdpChange,
  placeholder,
  label,
  buttonText,
  onButtonClick,
  instructions,
  hasContent, // Can now be undefined
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!sdp || sdp === '[]') {
      return;
    }
    navigator.clipboard.writeText(sdp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="text-lg font-semibold text-gray-200">{label}</h3>
      <p className="text-sm text-gray-400 -mt-1">{instructions}</p>
      <div className="relative">
        <textarea
          value={sdp}
          onChange={onSdpChange}
          placeholder={placeholder}
          readOnly={!onSdpChange}
          className="w-full h-28 p-3 font-mono text-xs bg-gray-900 border border-gray-700 rounded-lg text-gray-300 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        {/* This logic already works correctly if hasContent is undefined */}
        {!onSdpChange && hasContent && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-indigo-600 text-white px-3 py-1 text-xs font-semibold rounded-md transition duration-200"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={!sdp}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default SdpTextarea;

