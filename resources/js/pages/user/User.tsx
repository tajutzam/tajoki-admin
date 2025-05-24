import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
};

type PageProps = {
    users: {
        data: User[];
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    total: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar User',
        href: '/user',
    },
];

export default function Index() {
    const { users } = usePage<PageProps>().props;
    const { total } = usePage<PageProps>().props;

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleAddUser = () => {
        post('/users', {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const handleEditClick = (user: User) => {
        setEditUserId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '',
        });
        setEditDialogOpen(true);
    };

    const handleUpdateUser = () => {
        if (editUserId !== null) {
            put(`/users/${editUserId}`, {
                onSuccess: () => {
                    reset();
                    setEditDialogOpen(false);
                },
            });
        }
    };

    const handleDeleteUser = (userId: number) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            destroy(`/users/${userId}`);
        }
    };

    return (
        <>
            <Head title="User List" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <Card className="w-[300px]">
                            <CardHeader>
                                <CardTitle>Total User</CardTitle>
                                <CardDescription>{total}</CardDescription>
                            </CardHeader>
                        </Card>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="bg-primary text-primary-foreground">
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add User</DialogTitle>
                                    <DialogDescription>Tambahkan user baru</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <Input id="name" className="col-span-3" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            className="col-span-3"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            Password
                                        </Label>
                                        <Input
                                            type="password"
                                            id="password"
                                            className="col-span-3"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleAddUser} disabled={processing}>
                                        Save User
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" onClick={() => handleEditClick(user)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                                                <Trash2Icon size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-end gap-2">
                        {users.prev_page_url && (
                            <Link href={users.prev_page_url}>
                                <Button variant="outline">Sebelumnya</Button>
                            </Link>
                        )}
                        {users.next_page_url && (
                            <Link href={users.next_page_url}>
                                <Button variant="outline">Selanjutnya</Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Perbarui data user</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                    Name
                                </Label>
                                <Input id="edit-name" className="col-span-3" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-email" className="text-right">
                                    Email
                                </Label>
                                <Input id="edit-email" className="col-span-3" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            </div>
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleUpdateUser} disabled={processing}>
                                Update User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </>
    );
}
