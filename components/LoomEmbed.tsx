"use client";

interface LoomEmbedProps {
  url: string;
  title: string;
}

export default function LoomEmbed({ url, title }: LoomEmbedProps) {
  if (!url) {
    return (
      <div className="w-full rounded-xl border border-dark-700 bg-dark-900 overflow-hidden">
        <div className="aspect-video flex items-center justify-center bg-dark-900/50">
          <div className="text-center px-6">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-dark-300 text-sm">{title}</p>
            <p className="text-dark-500 text-xs mt-1">
              Loom video coming soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  const loomId = url.split("/").pop()?.split("?")[0];

  return (
    <div className="w-full rounded-xl border border-dark-700 overflow-hidden">
      <div className="aspect-video">
        <iframe
          src={`https://www.loom.com/embed/${loomId}`}
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
