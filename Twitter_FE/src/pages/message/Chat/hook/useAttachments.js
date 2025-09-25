import { useState } from "react";
import toast from "react-hot-toast";
import {
  ALLOWED_EXTENSIONS,
  MAX_FILES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_FILE_SIZE,
} from "../MessageInput/constants";

export function useAttachments() {
  const [attachments, setAttachments] = useState([]);

  const validateFile = (file) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast.error(`Định dạng không được hỗ trợ: .${ext}`);
      return false;
    }

    if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE) {
      toast.error("Ảnh vượt quá 5MB!");
      return false;
    }
    if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE) {
      toast.error("Video vượt quá 100MB!");
      return false;
    }
    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/") &&
      file.size > MAX_FILE_SIZE
    ) {
      toast.error("File vượt quá 10MB!");
      return false;
    }

    return true;
  };

  const addFiles = (files) => {
    const validFiles = Array.from(files).filter((f) => validateFile(f));
    const total = attachments.length + validFiles.length;

    if (total > MAX_FILES) {
      toast.error(`Chỉ được chọn tối đa ${MAX_FILES} file!`);
      const allowedToAdd = MAX_FILES - attachments.length;
      if (allowedToAdd > 0) {
        setAttachments((prev) => [
          ...prev,
          ...validFiles.slice(0, allowedToAdd),
        ]);
      }
      return;
    }

    if (validFiles.length) setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return { attachments, setAttachments, addFiles, removeFile };
}
