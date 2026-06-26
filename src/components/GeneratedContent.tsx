import React from 'react';
import { marked } from 'marked';
import type { GenerateResponse } from '../types/api';

interface GeneratedContentProps {
  data: GenerateResponse;
  topic?: string;
  contentType?: string;
  tone?: string;
  imageStyle?: string;
  generationTime?: number | null;
  onSave: () => void;
  isSaved: boolean;
  onRefineClick: () => void;
}

export const GeneratedContent: React.FC<GeneratedContentProps> = ({
  data,
  topic,
  contentType,
  tone,
  imageStyle,
  generationTime,
  onSave,
  isSaved,
  onRefineClick
}) => {
  const { text, imageUrl } = data;

  // Convert markdown to HTML string
  const rawHtml = text ? (marked.parse(text) as string) : '';

  // Calculate word count
  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleDownloadMarkdown = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTopic = (topic || 'generated-content')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    link.setAttribute('download', `${safeTopic}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTopic = (topic || 'banner')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      link.setAttribute('download', `${safeTopic}-banner.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image via fetch, falling back to open in new tab', error);
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
      {/* Left Column: Main Article Content Container */}
      <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-left">
        {/* Topic Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl leading-tight border-b border-neutral-100 pb-5">
          {topic || 'Generated Asset'}
        </h1>

        {/* Hero Image */}
        {imageUrl && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-xs aspect-video relative w-full">
            <img
              src={imageUrl}
              alt={topic || 'Generated Asset'}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Markdown Body */}
        <div 
          className="markdown-body text-neutral-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: rawHtml }}
        />
      </div>

      {/* Right Column: Sidebar (Save Button & Generation Metadata Card) */}
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        {/* Save Actions Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1">Actions</span>
          <button
            onClick={onSave}
            disabled={isSaved}
            className={`w-full flex items-center justify-center space-x-2 py-2.5 border rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs ${
              isSaved
                ? 'border-neutral-200 text-neutral-400 bg-neutral-50 cursor-not-allowed'
                : 'border-black text-white bg-black hover:bg-neutral-800 active:bg-neutral-900'
            }`}
          >
            {isSaved ? (
              <>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Saved to Library</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save to Library</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center justify-center space-x-2 py-2.5 border border-neutral-250 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Markdown</span>
          </button>

          {imageUrl && (
            <button
              onClick={handleDownloadImage}
              className="w-full flex items-center justify-center space-x-2 py-2.5 border border-neutral-250 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Download Banner Image</span>
            </button>
          )}

          <button
            onClick={onRefineClick}
            className="w-full flex items-center justify-center space-x-2 py-2.5 border border-neutral-250 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
            <span>Regenerate</span>
          </button>
        </div>

        {/* Generation Metadata Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-neutral-100 pb-2.5">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Generation Summary</h4>
          </div>
          
          <div className="space-y-3.5 text-xs text-neutral-600 font-sans">
            {generationTime && (
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-neutral-450">
                  <span>⚡</span> Latency
                </span>
                <span className="font-semibold text-neutral-900">{(generationTime / 1000).toFixed(1)} sec</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-neutral-450">
                <span>📝</span> Content Type
              </span>
              <span className="font-semibold text-neutral-900">{contentType || 'Article'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-neutral-450">
                <span>🎯</span> Tone
              </span>
              <span className="font-semibold text-neutral-900">{tone || 'Professional'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-neutral-450">
                <span>🎨</span> Style
              </span>
              <span className="font-semibold text-neutral-900">{imageStyle || 'Minimalist'}</span>
            </div>
            <div className="flex justify-between items-center border-t border-neutral-150 pt-3">
              <span className="flex items-center gap-2 text-neutral-450">
                <span>📊</span> Word Count
              </span>
              <span className="font-bold text-neutral-900">{wordCount} words</span>
            </div>
            {data.metrics && (
              <>
                <div className="flex justify-between items-center border-t border-neutral-150 pt-3">
                  <span className="flex items-center gap-2 text-neutral-450">
                    <span>🪙</span> Tokens
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {data.metrics.totalTokens.toLocaleString()} <span className="text-[10px] text-neutral-400 font-normal">({data.metrics.promptTokens} in / {data.metrics.outputTokens} out)</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-neutral-450">
                    <span>✍️</span> Text Cost
                  </span>
                  <span className="font-semibold text-neutral-900">₹{data.metrics.textCostINR.toFixed(2)}</span>
                </div>
                {data.metrics.imageCostINR > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-neutral-450">
                      <span>🖼️</span> Image Cost
                    </span>
                    <span className="font-semibold text-neutral-900">₹{data.metrics.imageCostINR.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-neutral-150 pt-2.5">
                  <span className="flex items-center gap-2 text-neutral-450 font-semibold">
                    <span>💰</span> Total Cost
                  </span>
                  <span className="font-bold text-green-600">₹{data.metrics.totalCostINR.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
