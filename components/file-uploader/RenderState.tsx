import { CloudUploadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon className={`size-6 text-muted-foreground ${isDragActive && "text-primary"}`} />
      </div>
      <p className="text-base font-semibold text-foreground mb-6">
        Drop your files here or <span className="text-primary font-bold cursor-pointer">click to upload</span>
      </p>
      <Button type="button">Browse Files</Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={`size-6 text-destructive`} />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">something went wrong</p>
      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
}
