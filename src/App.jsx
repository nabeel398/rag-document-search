import React, { useState } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Select a file first!");
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setLoading(false);
    alert(`Uploaded ${data.documents_added} chunks successfully!`);
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    const formData = new FormData();
    formData.append("query", query);

    const res = await fetch("http://127.0.0.1:8000/query", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    setQuery("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📄 RAG Document Search
      </h1>

      {/* File Upload */}
      <div className="mb-6 w-full max-w-lg">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white p-2"
        />
        <button
          onClick={handleUpload}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Documents"}
        </button>
      </div>

      {/* Chat */}
      <div className="w-full max-w-lg flex flex-col space-y-4 bg-white p-4 rounded-lg shadow">
        <div className="h-80 overflow-y-auto space-y-2 border-b pb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-green-100 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 border rounded-lg p-2"
          />
          <button
            onClick={handleQuery}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
