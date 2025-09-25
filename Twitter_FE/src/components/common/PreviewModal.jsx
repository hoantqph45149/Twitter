const PreviewModal = ({ previewMedia, setPreviewMedia }) => {
  if (!previewMedia) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={() => setPreviewMedia(null)}
    >
      <div
        className="relative max-w-full max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {previewMedia.type === "image" ? (
          <img
            src={previewMedia.url}
            alt={previewMedia.fileName || "image"}
            className="rounded-lg max-h-[80vh] max-w-[90vw] object-contain"
          />
        ) : (
          <video
            src={previewMedia.url}
            controls
            autoPlay
            className="rounded-lg max-h-[80vh] max-w-[90vw] object-contain"
          />
        )}
      </div>

      {/* Nút đóng */}
      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={() => setPreviewMedia(null)}
      >
        ✕
      </button>
    </div>
  );
};

export default PreviewModal;
