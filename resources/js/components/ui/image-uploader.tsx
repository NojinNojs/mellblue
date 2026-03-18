import { Label } from '@/components/ui/label';
import { Trash2, Edit3, UploadCloud, Images } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageCropper } from './image-cropper';
import { toast } from 'sonner';

export interface ExistingImage {
    id: number;
    url?: string;
    image_url?: string;
}

interface ImageUploaderProps {
    label?: string;
    maxImages?: number;
    existingImages?: ExistingImage[];
    previewImages: string[];
    onImageSelect: (file: File) => void;
    onRemoveExisting: (id: number) => void;
    onRemoveNew: (index: number) => void;
    aspectRatio?: number;
    error?: string;
}

export function ImageUploader({
    label = 'Images',
    maxImages = 5,
    existingImages = [],
    previewImages = [],
    onImageSelect,
    onRemoveExisting,
    onRemoveNew,
    aspectRatio = 3 / 4,
    error,
}: ImageUploaderProps) {
    // queue of raw dataURLs awaiting crop
    const [queue, setQueue] = useState<string[]>([]);
    // currently being cropped
    const [activeCrop, setActiveCrop] = useState<string | null>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    // original dataURLs for re-crop
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    // which new-preview is being re-cropped
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const totalCount = existingImages.length + previewImages.length;
    const remainingSlots = maxImages - totalCount;

    // Auto-pop from queue when cropper is closed
    useEffect(() => {
        if (!isCropperOpen && !editIndex && queue.length > 0) {
            const [next, ...rest] = queue;
            setQueue(rest);
            setActiveCrop(next);
            setEditIndex(null);
            setIsCropperOpen(true);
        }
    }, [isCropperOpen, queue, editIndex]);

    const enqueueFiles = useCallback(
        (files: File[]) => {
            const slots = maxImages - totalCount - queue.length;
            if (slots <= 0) {
                toast.error(`Maximum ${maxImages} images reached`);
                return;
            }
            const toProcess = files.slice(0, slots);
            if (toProcess.length < files.length) {
                toast.info(`Only ${slots} slot${slots > 1 ? 's' : ''} remaining — added first ${toProcess.length}`);
            }

            const readers = toProcess.map(
                (file) =>
                    new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    }),
            );

            Promise.all(readers).then((dataUrls) => {
                setQueue((prev) => [...prev, ...dataUrls]);
            });
        },
        [totalCount, maxImages, queue.length],
    );

    const onDrop = useCallback(
        (accepted: File[]) => {
            if (accepted.length === 0) return;
            enqueueFiles(accepted);
        },
        [enqueueFiles],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
        disabled: remainingSlots <= 0 && queue.length === 0,
        multiple: true,
    });

    const handleCropComplete = useCallback(
        (blob: Blob) => {
            const file = new File([blob], `img-${Date.now()}.webp`, { type: 'image/webp' });

            if (editIndex !== null && activeCrop) {
                // Replace the re-cropped image
                onRemoveNew(editIndex);
                setOriginalImages((prev) => prev.filter((_, i) => i !== editIndex));
                onImageSelect(file);
                setOriginalImages((prev) => [...prev, activeCrop]);
                setEditIndex(null);
            } else if (activeCrop) {
                onImageSelect(file);
                setOriginalImages((prev) => [...prev, activeCrop]);
            }

            setActiveCrop(null);
        },
        [activeCrop, editIndex, onImageSelect, onRemoveNew],
    );

    const handleCropperOpenChange = (open: boolean) => {
        setIsCropperOpen(open);
        if (!open) {
            // If cancelled, discard the rest of the queue
            if (editIndex === null) {
                setActiveCrop(null);
                setQueue([]);
            } else {
                setEditIndex(null);
                setActiveCrop(null);
            }
        }
    };

    const handleEditNew = (index: number) => {
        const src = originalImages[index];
        if (src) {
            setActiveCrop(src);
            setEditIndex(index);
            setIsCropperOpen(true);
        }
    };

    const handleRemoveNew = (index: number) => {
        onRemoveNew(index);
        setOriginalImages((prev) => prev.filter((_, i) => i !== index));
    };

    const hasImages = existingImages.length > 0 || previewImages.length > 0;

    return (
        <div className="space-y-4 border-t pt-4">
            {/* Label row */}
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5 text-sm font-semibold">
                    <Images className="h-4 w-4 text-muted-foreground" />
                    {label}
                </Label>
                <span className="text-xs text-muted-foreground">
                    {totalCount} / {maxImages}
                </span>
            </div>

            {/* Dropzone */}
            {remainingSlots > 0 && (
                <div
                    {...getRootProps()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
                        isDragActive
                            ? 'border-primary bg-primary/8 scale-[1.01] shadow-md'
                            : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/30'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <div
                            className={`rounded-2xl p-4 transition-all duration-200 ${
                                isDragActive
                                    ? 'bg-primary/15 text-primary'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                        >
                            <UploadCloud className={`h-7 w-7 transition-transform duration-200 ${isDragActive ? 'scale-110' : ''}`} />
                        </div>
                        <div className="space-y-0.5 text-center">
                            <p className="text-sm font-medium text-foreground">
                                {isDragActive ? 'Release to add images' : 'Drop images here, or click to browse'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG, WebP · max {remainingSlots} more image{remainingSlots !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    {/* Drag overlay */}
                    {isDragActive && (
                        <div className="absolute inset-0 rounded-xl border-2 border-primary/50 bg-primary/5" />
                    )}
                </div>
            )}

            {/* Previews */}
            {hasImages && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {/* Existing */}
                    {existingImages.map((img) => (
                        <div
                            key={`ex-${img.id}`}
                            className="group relative overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-border transition-all hover:ring-destructive/50"
                            style={{ aspectRatio: String(aspectRatio) }}
                        >
                            <img
                                src={img.url || `/storage/${img.image_url}`}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => onRemoveExisting(img.id)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* New previews */}
                    {previewImages.map((src, idx) => (
                        <div
                            key={`new-${idx}`}
                            className="group relative overflow-hidden rounded-lg bg-muted shadow-sm ring-1 ring-primary/20 transition-all hover:ring-primary/40"
                            style={{ aspectRatio: String(aspectRatio) }}
                        >
                            <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => handleEditNew(idx)}
                                    title="Re-crop"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveNew(idx)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cropper */}
            {activeCrop && (
                <ImageCropper
                    image={activeCrop}
                    open={isCropperOpen}
                    onOpenChange={handleCropperOpenChange}
                    onCropComplete={handleCropComplete}
                    aspectRatio={aspectRatio}
                />
            )}

            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
    );
}
