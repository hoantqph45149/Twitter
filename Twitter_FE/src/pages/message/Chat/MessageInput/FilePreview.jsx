import { FaFile, FaPlayCircle } from "react-icons/fa";

export default function FilePreview({ file, index, removeFile }) {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  return (
    <div
      className={`relative rounded-md overflow-hidden bg-gray-700 flex items-center justify-center ${
        isImage || isVideo ? "w-14 h-14" : "max-w-40 h-14"
      }`}
    >
      {isImage && (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      )}

      {isVideo && (
        <>
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FaPlayCircle className="text-gray-400 text-2xl" />
          </div>
        </>
      )}

      {!isImage && !isVideo && (
        <div className="w-full h-full flex items-center justify-center text-white text-[10px] px-2">
          <span className="text-lg w-6 h-6 flex items-center justify-center bg-gray-600 rounded mr-2">
            <FaFile />
          </span>
          <span
            className="flex-1 text-[10px] break-words line-clamp-2"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
      )}

      <button
        onClick={() => removeFile(index)}
        className="absolute -top-1 -right-1 bg-black bg-opacity-70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
      >
        ✕
      </button>
    </div>
  );
}
