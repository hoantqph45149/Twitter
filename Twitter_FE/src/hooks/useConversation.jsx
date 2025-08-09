import { useState, useEffect } from "react";

export default function useConversations() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        fetch("/api/conversations")
          .then((response) => response.json())
          .then((data) => {
            setConversations(data.data);
          });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchConversations();
  }, []);

  return { conversations, setConversations };
}
