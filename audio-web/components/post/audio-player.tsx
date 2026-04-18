import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "../ui/button";

export function AudioPlayer({ sound }: { sound: string }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getOrCreateAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sound);
      audioRef.current.volume = 0.5,
      audioRef.current.onended = () => setIsPlaying(false)
    }
    return audioRef.current;
  }

  const handlePlayer = () => {
    const audio = getOrCreateAudio();
    if (isPlaying) {
      audio.pause()
      audio.currentTime = 0;
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }
  return (
    <div className="">
      <Button onClick={handlePlayer}>
        {isPlaying ? <Pause /> : <Play />}
      </Button>
    </div>
  )
}
