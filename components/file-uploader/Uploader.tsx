"use client";

import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

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

const Uploader = ({ onChange, value }: UploaderProps) => {
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
    key: value,
  });

  const uploadAndDeleteErrorHandler = (message: string) => {
    toast.error(message);
    setFileState((prev) => ({
      ...prev,
      uploading: false,
      isDeleting: false,
      progress: 0,
      error: true,
    }));
  };

  const removeFileHandler = async () => {
    setFileState((prev) => ({
      ...prev,
      isDeleting: true,
    }));
    try {
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        uploadAndDeleteErrorHandler("Failed to remove file from storage :(");
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image",
        objectUrl: undefined,
      });

      toast.success("File deleted successfully");
    } catch (error) {
      console.log("Deleting Error:", error);
      uploadAndDeleteErrorHandler("Failed to remove file. Please try again");
    }
  };

  const uploadFile = async (file: File) => {
    setFileState({
      id: uuidv4(),
      file: file,
      uploading: true,
      progress: 0,
      isDeleting: false,
      error: false,
      fileType: "image",
      objectUrl: URL.createObjectURL(file),
    });

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
        uploadAndDeleteErrorHandler("فشل في جلب رابط الرفع");
        return;
      }

      let data;
      try {
        data = await presignedResponse.json();
      } catch (err) {
        uploadAndDeleteErrorHandler("فشل في تحليل استجابة الخادم");
        return;
      }

      const { preSignedUrl, key } = await data;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
            }));
          }
        };

        xhr.onload = () => {
          console.log("XHR Status:", xhr.status);
          console.log("XHR Response:", xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));

            onChange?.(key);

            toast.success("File uploaded successfully");

            resolve();
          } else {
            const errorMsg = `Upload failed: ${xhr.status} - ${xhr.responseText}`;
            console.error(errorMsg);
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () => {
          console.error("Network error:", xhr.status);
          reject(new Error("فشل في الاتصال"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.withCredentials = false;
        xhr.responseType = "text";
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error("Upload error:", error);
      uploadAndDeleteErrorHandler("فشل في رفع الملف");
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        uploadFile(file);
      }
    },
    [fileState.objectUrl]
  );

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
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const renderContent = () => {
    if (fileState.uploading) return <RenderUploadingState progress={fileState.progress} file={fileState.file as File} />;
    else if (fileState.error) return <RenderErrorState />;
    else if (fileState.objectUrl)
      return <RenderUploadedState previewUrl={fileState.objectUrl} isDeleting={fileState.isDeleting} removeFileHandler={removeFileHandler} />;
    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  return (
    <Card
      {...getRootProps()}
      className={`relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64
      ${isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"}`}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;
