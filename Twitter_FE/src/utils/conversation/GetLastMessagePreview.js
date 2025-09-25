function getLastMessagePreview(message, authUser) {
  if (!message) return "No messages yet";
  const prefix =
    message.senderId?._id === authUser._id
      ? "You: "
      : message.senderId?.fullName + ": ";
  // Nếu có media
  if (message.media && message.media.length > 0) {
    const images = message.media.filter((m) => m.type.startsWith("image"));
    const videos = message.media.filter((m) => m.type.startsWith("video"));
    const files = message.media.filter(
      (m) => !m.type.startsWith("image") && !m.type.startsWith("video")
    );

    const parts = [];
    if (images.length === 1) parts.push("📷 Photo");
    if (images.length > 1) parts.push(`📷 ${images.length} Photos`);
    if (videos.length === 1) parts.push("🎥 Video");
    if (videos.length > 1) parts.push(`🎥 ${videos.length} Videos`);
    if (files.length === 1) parts.push("📎 File");
    if (files.length > 1) parts.push(`📎 ${files.length} Files`);

    return prefix + parts.join(" · ");
  }
  // Nếu không có media thì lấy content
  return prefix + (message.content || "");
}
export default getLastMessagePreview;
