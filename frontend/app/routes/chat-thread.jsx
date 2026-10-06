import {ChatInput, ChatMessages} from "../components/Chat";
import {useLoaderData} from "react-router"

export async function clientLoader({ params }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const threadId = params.threadId;
  const threadURL = `${supabaseUrl}/rest/v1/threads?id=eq.${threadId}&select=*`;

  const response = await fetch(threadURL, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    }
  });

  const threadData = await response.json(); 
  const thread = threadData[0]; 

  if (!thread) {
    throw new Response("Thread not found", { status: 404 });
  }
  const messagesURL = `${supabaseUrl}/rest/v1/messages?thread_id=eq.${threadId}&select=*`;
  const messagesResponse = await fetch(messagesURL, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    }
  });


  const messagesData = await messagesResponse.json();

  const messages = messagesData;

  if (!messagesResponse.ok) {
    throw new Response("No messages found", { status: messagesResponse.status });
  }
  return { thread, messages };

}


export default function ChatThread() {
  const { thread, messages } = useLoaderData();

  const addMessage = (text) => {
    console.log("Message mutation not implemented yet:", text);
  };

  return (

      <><div className="chat-thread-header">
      <h2>{thread.title}</h2>
    </div><ChatMessages messages={messages} /><ChatInput onAddMessage={addMessage} /></>

  );
}



