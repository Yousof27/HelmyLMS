"use client";

import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { RenderEmptyState, RenderErrorState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

const Uploader = () => {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
  });

  const uploadFile = async (file: File) => {
    setFileState((p) => ({ ...p, uploading: true, progress: 0 }));

    try {
      const presignedResponse = await fetch(`/api/s3/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((p) => ({ ...p, uploading: false, progress: 0, error: true }));
      }

      const { preSignedUrl, key } = await presignedResponse.json();

    } catch (error) {}
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      setFileState({
        id: uuidv4(),
        file: file,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image",
        objectUrl: URL.createObjectURL(file),
      });
    }
  }, []);

  const onDropRejectedHandler = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === "too-many-files");
      const invalidFileType = fileRejection.find((rejection) => rejection.errors[0].code === "file-invalid-type");
      const tooBigFileSize = fileRejection.find((rejection) => rejection.errors[0].code === "file-too-large");

      if (tooManyFiles) toast.error("Too many files selected, max is 1");
      if (invalidFileType) toast.error("Invalid file type, only accepted images");
      if (tooBigFileSize) toast.error("File size exceeds the limit, max is 5MB");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 1024 * 1024 * 5,
    onDropRejected: onDropRejectedHandler,
  });

  return (
    <Card {...getRootProps()} className={`relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64 border-primary`}>
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        <RenderEmptyState isDragActive={isDragActive} />
        {/* <RenderErrorState /> */}
      </CardContent>
    </Card>
  );
};

export default Uploader;
