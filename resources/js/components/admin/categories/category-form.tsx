import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

export interface Category {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
    created_at?: string;
}

interface CategoryFormProps {
    category?: Category | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoryForm({
    category,
    onSuccess,
    onCancel,
}: CategoryFormProps) {
    const isEdit = !!category;

    const form = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && category) {
            form.put(`/admin/categories/${category.id}`, {
                onSuccess: () => {
                    form.reset();
                    onSuccess();
                },
            });
        } else {
            form.post('/admin/categories', {
                onSuccess: () => {
                    form.reset();
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        placeholder="e.g. Occasion Gifts"
                        required
                    />
                    {form.errors.name && (
                        <p className="text-sm text-destructive">
                            {form.errors.name}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug (Optional for new)</Label>
                    <Input
                        id="slug"
                        value={form.data.slug}
                        onChange={(e) => form.setData('slug', e.target.value)}
                        placeholder="e.g. occasion-gifts"
                        required={isEdit} // strictly required if editing to prevent empty slug updates
                    />
                    {!isEdit && (
                        <p className="text-xs text-muted-foreground">
                            Leave empty to generate automatically from name.
                        </p>
                    )}
                    {form.errors.slug && (
                        <p className="text-sm text-destructive">
                            {form.errors.slug}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing
                        ? isEdit
                            ? 'Saving...'
                            : 'Creating...'
                        : isEdit
                          ? 'Save Changes'
                          : 'Create Category'}
                </Button>
            </div>
        </form>
    );
}
