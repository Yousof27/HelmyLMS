import useConstructUrl from "@/hooks/use-construct-url";
import { BookIcon } from "lucide-react";

interface VideoPlayerProps {
  thumbnailKey: string;
  videoKey: string;
}

const VideoPlayer = ({ thumbnailKey, videoKey }: VideoPlayerProps) => {
  if (!videoKey) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
        <BookIcon className="size-16 text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">This lesson does not have a video yet</p>
      </div>
    );
  }

  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailKey);

  return (
    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
      <video className="w-full h-full" controls poster={thumbnailUrl}>
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/ogg" />
        Your browser does not suport the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
