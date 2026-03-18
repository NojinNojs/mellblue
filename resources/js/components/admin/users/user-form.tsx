import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    created_at: string;
}

interface UserFormProps {
    user?: User | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
    const isEdit = !!user;

    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || ('customer' as 'admin' | 'customer'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && user) {
            form.put(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    form.reset();
                    onSuccess();
                },
            });
        } else {
            form.post('/admin/users', {
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
                        required
                    />
                    {form.errors.name && (
                        <p className="text-sm text-destructive">
                            {form.errors.name}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        required
                    />
                    {form.errors.email && (
                        <p className="text-sm text-destructive">
                            {form.errors.email}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">
                        {isEdit ? 'New Password (optional)' : 'Password'}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.target.value)
                        }
                        placeholder={
                            isEdit ? 'Leave empty to keep current' : ''
                        }
                        required={!isEdit}
                    />
                    {form.errors.password && (
                        <p className="text-sm text-destructive">
                            {form.errors.password}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                        value={form.data.role}
                        onValueChange={(value) =>
                            form.setData('role', value as 'admin' | 'customer')
                        }
                    >
                        <SelectTrigger id="role">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.errors.role && (
                        <p className="text-sm text-destructive">
                            {form.errors.role}
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
                          : 'Create User'}
                </Button>
            </div>
        </form>
    );
}
