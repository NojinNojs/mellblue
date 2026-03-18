import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Crop, Maximize2, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

type CropMode = 'crop' | 'fit';

interface ImageCropperProps {
    image: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCropComplete: (croppedImage: Blob) => void;
    aspectRatio?: number;
}

export function ImageCropper({
    image,
    open,
    onOpenChange,
    onCropComplete,
    aspectRatio = 3 / 4,
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [mode, setMode] = useState<CropMode>('crop');
    const [isSaving, setIsSaving] = useState(false);

    const onCropCompleteHandler = useCallback(
        (_: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        [],
    );

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', reject);
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const img = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2d context');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Canvas is empty'));
                resolve(blob);
            }, 'image/webp', 0.92);
        });
    };

    const getFitToFrameImg = async (imageSrc: string): Promise<Blob> => {
        const img = await createImage(imageSrc);
        const targetW = 900;
        const targetH = Math.round(targetW / aspectRatio);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2d context');

        canvas.width = targetW;
        canvas.height = targetH;

        // Dark fill
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, targetW, targetH);

        const imgAspect = img.width / img.height;
        const targetAspect = targetW / targetH;
        let dw: number, dh: number, dx: number, dy: number;

        if (imgAspect > targetAspect) {
            dw = targetW;
            dh = targetW / imgAspect;
            dx = 0;
            dy = (targetH - dh) / 2;
        } else {
            dh = targetH;
            dw = targetH * imgAspect;
            dx = (targetW - dw) / 2;
            dy = 0;
        }

        ctx.drawImage(img, dx, dy, dw, dh);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Canvas is empty'));
                resolve(blob);
            }, 'image/webp', 0.92);
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let result: Blob;
            if (mode === 'fit') {
                result = await getFitToFrameImg(image);
            } else {
                if (!croppedAreaPixels) return;
                result = await getCroppedImg(image, croppedAreaPixels);
            }
            onCropComplete(result);
            onOpenChange(false);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setMode('crop');
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setMode('crop');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-4 p-0 overflow-hidden sm:max-w-[560px]">
                {/* Header */}
                <DialogHeader className="px-5 pt-5">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Crop className="h-4 w-4 text-primary" />
                        Adjust Image
                    </DialogTitle>
                </DialogHeader>

                {/* Mode Toggle */}
                <div className="px-5">
                    <div className="flex gap-1 rounded-lg bg-muted p-1">
                        <button
                            type="button"
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                mode === 'crop'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => setMode('crop')}
                        >
                            <Crop className="h-3.5 w-3.5" />
                            Crop
                        </button>
                        <button
                            type="button"
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                mode === 'fit'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={() => setMode('fit')}
                        >
                            <Maximize2 className="h-3.5 w-3.5" />
                            Fit to Frame
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                {mode === 'crop' ? (
                    <div className="relative h-[360px] w-full bg-[#111]">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropCompleteHandler}
                        />
                    </div>
                ) : (
                    <div className="relative flex h-[360px] items-center justify-center overflow-hidden bg-[#111]">
                        <img
                            src={image}
                            alt="Fit preview"
                            className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                            <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                                Dark bars will fill empty space
                            </span>
                        </div>
                    </div>
                )}

                {/* Zoom (Crop mode only) */}
                {mode === 'crop' && (
                    <div className="space-y-2 px-5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Zoom</span>
                            <span className="text-sm tabular-nums text-muted-foreground">
                                {zoom.toFixed(1)}x
                            </span>
                        </div>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                        />
                    </div>
                )}

                <DialogFooter className="px-5 pb-5">
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing…
                            </>
                        ) : (
                            'Apply'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
