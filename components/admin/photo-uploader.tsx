"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImagePlus, X, GripVertical, Loader2 } from "lucide-react";
import { photoKey, type StagedDisplayPhoto } from "@/lib/hooks/use-photo-staging";

interface PhotoUploaderProps {
  photos: StagedDisplayPhoto[];
  uploading: boolean;
  onPickFiles: (files: FileList | File[]) => void;
  onRemove: (photo: StagedDisplayPhoto) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function PhotoUploader({
  photos,
  uploading,
  onPickFiles,
  onRemove,
  onReorder,
}: PhotoUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onPickFiles(e.dataTransfer.files);
      }
    },
    [onPickFiles],
  );

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOverItem = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    onReorder(dragIdx, idx);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Photos</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
          p-6 cursor-pointer transition-all
          ${
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </>
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Drag & drop images here, or click to browse
            </span>
            <span className="text-xs text-muted-foreground/70">
              Changes apply when you click Save or Publish
            </span>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onPickFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, idx) => (
            <Card
              key={photoKey(photo)}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOverItem(e, idx)}
              onDragEnd={handleDragEnd}
              className={`
                group relative overflow-hidden rounded-xl border-none ring-0 shadow-warm-sm
                cursor-grab active:cursor-grabbing transition-all
                ${dragIdx === idx ? "opacity-50 scale-95" : ""}
              `}
            >
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-white drop-shadow" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-red-500 text-white hover:text-white rounded-full h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(photo);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
