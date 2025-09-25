function formatConversationTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffHour < 1) {
    // <1h → exact time
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDay < 1) {
    // <1 day → "x hours ago"
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    // <1 week → weekday
    return date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...
  } else if (diffDay < 365) {
    // <1 year → MM/DD
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
    });
  } else {
    // >=1 year → MM/DD/YYYY
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
}

export default formatConversationTime;
