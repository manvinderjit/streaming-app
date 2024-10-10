import { useEffect, useRef } from "react";

interface VideoPlayerable {
    videoId: string,
}

const VideoPlayer = (props: VideoPlayerable) => {

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.pause();
            videoRef.current.removeAttribute('src');
            videoRef.current.load();
        }
    });

    return (
        <video ref={videoRef} width={'1280px'} height={'720px'} controls autoPlay>
            <source src={`http://localhost:5000/videos/${props.videoId}`} type={'video/mp4'}></source>
            Your browser does not support this video!
        </video>
    )
}

export default VideoPlayer;
