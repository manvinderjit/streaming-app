import './App.css';
import VideoPlayer from './Components/VideoPlayer';
import { MouseEvent, useState } from 'react';

const App = () => {
  const [videoId, setVideoId] = useState<null | string>(null);
  
  const playVideo = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, videoId: string) => {
    e.preventDefault();
    setVideoId(videoId);
  };

  return (
    <>
      {videoId && <VideoPlayer videoId={videoId}></VideoPlayer>}
      <br />
      <button onClick={(e) => playVideo(e, "1")} value={"1"}>
        Play Video 1
      </button>
      <button onClick={(e) => playVideo(e, "2")} value={"2"}>
        Play Video 2
      </button>
    </>
  );
}

export default App
