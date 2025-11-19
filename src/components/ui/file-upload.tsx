import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";

export interface FileUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function FileUpload({ value, onChange, className }: FileUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | undefined>(value);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onChange?.(result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileChange(file || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    setPreview(undefined);
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-input",
          preview ? "p-2" : "p-8"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative">
            <div className="relative w-full h-48 flex items-center justify-center">
              <Image
                src={preview}
                alt="Preview"
                width={200}
                height={200}
                className="max-h-48 w-auto object-contain rounded"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                Click to upload
              </span>
              {" or drag and drop"}
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 5MB
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
