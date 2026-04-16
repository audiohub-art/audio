import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { useState, useRef } from "react"
import { Upload, LoaderCircle } from "lucide-react"
import { uploadAudio } from "@/services/audio";
import { toast } from "sonner";
import { AudioPlayer } from "./audio-player";

const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/webm", "audio/mp3"];
const MAX_SIZE_MB = 100;

export function AudioUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }

  const handleFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Audio format not supported", { position: "top-right" });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Audio to high (max ${MAX_SIZE_MB} MB)`, { position: "top-right" });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const tempUrl = URL.createObjectURL(file)
    const { data, error } = await uploadAudio(formData);
    setIsLoading(false);

    if (error) {
      toast.error("Failed to upload audio", { position: "top-right" })
      return
    }
    setAudioUrl(tempUrl)
    setAudioFile(file)
    toast.success("Upload audio successfully", { position: "top-right" })
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  return (
  <div>
    { audioUrl && audioFile ? (
      <Card className="border rounded-lg p-10 text-center cursor-pointer transition-colors flex flex-col items-center gap-4">
        <CardHeader>
          <h1>{audioFile.name}</h1>
        </CardHeader>
      <CardContent>

        <AudioPlayer sound={audioUrl} />

      </CardContent>
      <CardFooter>
        <p>{(audioFile.size / 1000 / 1000).toFixed(1)} MB</p>
      </CardFooter>
    </Card>
  ): (
      <Card onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
      onDragLeave={() => setIsDrag(false)}
      onClick={() => fileInputRef.current?.click()}
      className={`border rounded-lg p-10 text-center cursor-pointer transition-colors flex flex-col items-center gap-4 ${isDrag ? "bg-blue-300" : "border-dashed"}`}>
        <input ref={fileInputRef} type="file" name="file" onChange={handleInputChange} required className="hidden border-0" accept={ALLOWED_TYPES.join(",")}/>
        <CardContent className="flex flex-col items-center">
          {isLoading ? <LoaderCircle className="animate-spin"/> : <Upload />}
          Choose a file here or drag here
        </CardContent>
        <CardFooter>
          Max 100 MB
          </CardFooter>
      </Card>

      )}
    </div>

  )
}
