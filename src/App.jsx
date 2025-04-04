import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";

export default function App() {
  const [channels, setChannels] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetch("https://ium.pro/stream_api/channels.json")
      .then((res) => res.json())
      .then((data) => setChannels(data))
      .catch((err) => console.error("Kanal verisi alınamadı:", err));
  }, []);

  useEffect(() => {
    if (selectedStream && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(selectedStream);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = selectedStream;
      }
    }
  }, [selectedStream]);

  const handleOpen = async (channelId) => {
    try {
      const res = await fetch(`https://ium.pro/stream_api/channel-detail.json?id=${channelId}`);
      const data = await res.json();
      setSelectedStream(data.stream);
      setOpen(true);
    } catch (error) {
      console.error("Yayın linki alınamadı:", error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>📺 Canlı Yayınlar</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {channels.map((channel, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
            <h3>{channel.name}</h3>
            <button onClick={() => handleOpen(channel.id)}>🔴 Yayını Aç</button>
            {channel.telegram && (
              <a href={channel.telegram} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}>
                📲 Telegram
              </a>
            )}
          </div>
        ))}
      </div>
      {open && selectedStream && (
        <div style={{ marginTop: 40 }}>
          <video ref={videoRef} controls autoPlay style={{ width: '100%', maxWidth: 800 }}></video>
        </div>
      )}
    </div>
  );
}
