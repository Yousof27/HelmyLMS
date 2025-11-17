import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon className={`size-6 text-muted-foreground ${isDragActive && "text-primary"}`} />
      </div>
      <p className="text-base font-semibold text-foreground mb-6">
        Drop your files here or <span className="text-primary font-bold cursor-pointer">click to upload</span>
      </p>
      <Button type="button" className="cursor-pointer">
        Browse Files
      </Button>
    </div>
  );
}

export function RenderErrorState({ reTryHandler }: { reTryHandler: () => void }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={`size-6 text-destructive`} />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">something went wrong</p>
      <Button onClick={reTryHandler} type="button" className="mt-4 cursor-pointer">
        Retry File Selection
      </Button>
    </div>
  );
}

interface RenderUploadedStateProps {
  previewUrl: string;
  isDeleting: boolean;
  removeFileHandler: () => void;
}

export function RenderUploadedState({ previewUrl, isDeleting, removeFileHandler }: RenderUploadedStateProps) {
  return (
    <div className="text-center">
      <Image src={previewUrl} alt="Uploaded File" fill className="object-contain p-2" />
      <Button
        onClick={removeFileHandler}
        disabled={isDeleting}
        type="button"
        variant="destructive"
        size="icon"
        className={`absolute top-4 right-4 cursor-pointer`}
      >
        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <XIcon className="size-4" />}
      </Button>
    </div>
  );
}

export function RenderUploadingState({ progress, file }: { progress: number; file: File }) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
    </div>
  );
}
