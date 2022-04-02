import React, { useCallback, useRef, useState } from "react";

interface CopyToClipboardProps {
  title: string;
  content: string;
  canCopy?: boolean;
}
export default function CopyToClipboard({
  title,
  content,
  canCopy = true,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const codeElement = useRef<HTMLPreElement>(null);

  const copyAddress = useCallback(() => {
    const text = codeElement.current?.textContent;
    if (text && canCopy && typeof window !== "undefined") {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        })
        .catch(() => {
          setCopied(false);
        });
    }
  }, [codeElement, canCopy]);

  return (
    <div className="relative w-full my-3 border-b-2 border-red-50 bg-white">
      <div className="bg-red-50 px-4 py-1 flex justify-between items-center">
        <div className="inline-block text-base">{title}</div>
        {canCopy && (
          <button
            onClick={copyAddress}
            className="text-base font-medium underline text-red-900 inline-block float-right"
          >
            {copied ? "Copied!" : "Click to copy"}
          </button>
        )}
      </div>
      <pre
        className="w-full text-sm md:text-base p-4 overflow-x-auto"
        ref={codeElement}
        onClick={copyAddress}
      >
        {content}
      </pre>
    </div>
  );
}
