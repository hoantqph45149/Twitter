import { FaFile, FaPlayCircle } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";

export default function MediaRenderer({ media, onPreview }) {
  if (media.type === "image") {
    return (
      <div className="relative">
        <img
          src={media.url}
          alt="attachment"
          className="rounded-lg cursor-pointer
          w-full max-w-[200px] max-h-[200px]
          sm:max-w-[250px] sm:max-h-[250px]
          md:max-w-[300px] md:max-h-[300px]
          lg:max-w-[400px] lg:max-h-[400px]
          object-cover"
          onClick={() => onPreview(media)}
        />
        {media.status === "uploading" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer
        w-full max-w-[220px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[450px]"
        onClick={() => onPreview(media)}
      >
        <video
          src={media.url}
          muted
          className="w-full rounded-lg pointer-events-none
          max-h-[200px] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[400px]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <FaPlayCircle className="text-white text-3xl opacity-70" />
        </div>
        {media.status === "uploading" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  if (media.type === "raw" || media.type === "file") {
    return (
      <div className="relative">
        <a
          href={media.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3 py-2
          bg-gray-800 rounded-lg text-sm text-blue-300 hover:bg-gray-700
          w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]"
        >
          <FaFile className="text-lg flex-shrink-0" />
          <span className="break-all whitespace-normal block truncate">
            {media.fileName}
          </span>
          <FiDownload className="flex-shrink-0" />
        </a>
        {media.status === "uploading" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
