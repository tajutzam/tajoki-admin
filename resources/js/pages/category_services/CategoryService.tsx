import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import PaginationButtons from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

type CategoryService = {
    id: number;
    name: string;
    description: string;
    start_from: number;
    image: string | File | null; // bisa string (url/path) atau File (upload)
};

type CategoryServicesProps = {
    categoryServices: {
        data: CategoryService[];
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    total: number;
};

export default function CategoryServices() {
    const { categoryServices, total } = usePage<CategoryServicesProps>().props;

    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const {
        data,
        setData,
        delete: destroy,
        reset,
        processing,
        errors,
    } = useForm<CategoryService>({
        id: 0,
        name: '',
        description: '',
        start_from: 0,
        image: null,
    });

    // buka dialog tambah
    const handleAdd = () => {
        reset();
        setEditingId(null);
        setOpenDialog(true);
    };

    // buka dialog edit
    const handleEdit = (item: CategoryService) => {
        setData({
            id: item.id,
            name: item.name,
            description: item.description,
            start_from: item.start_from,
            image: item.image,
        });
        setEditingId(item.id);
        setOpenDialog(true);
    };

    // hapus data
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            destroy(route('category-services.destroy', id), {
                onSuccess: () => {
                    // optional: notifikasi berhasil hapus
                },
            });
        }
    };

    // submit form (add/update)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');
        formData.append('start_from', data.start_from.toString());

        if (data.image && data.image instanceof File) {
            formData.append('image', data.image);
        }

        console.log('name:', data.name);
        console.log('start_from:', data.start_from);

        if (editingId) {
            formData.append('_method', 'put');

            router.post(route('category-services.update', editingId), formData, {
                forceFormData: true,
                onSuccess: () => setOpenDialog(false),
            });
        } else {
            router.post(route('category-services.store'), formData, {
                forceFormData: true,
                onSuccess: () => setOpenDialog(false),
            });
        }
    };

    return (
        <>
            <Head title="Category Services" />
            <AppLayout breadcrumbs={[{ title: 'Category Services', href: 'category-services' }]}>
                <div className="space-y-4 p-6">
                    <div className="mb-4">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Total Categori Service</CardTitle>
                                <CardDescription>{total} Categori Services telah ditambahkan</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    <div className="flex items-center justify-between">
                        <Button onClick={handleAdd} variant="default">
                            Tambah Kategori
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader className="bg-primary">
                                <TableRow>
                                    <TableCell className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama </TableCell>
                                    <TableCell className="px-4 py-2 text-left text-sm font-medium text-gray-700">Deskripsi </TableCell>
                                    <TableCell className="px-4 py-2 text-left text-sm font-medium text-gray-700">Start From </TableCell>
                                    <TableCell className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image </TableCell>
                                    <TableCell className="px-4 py-2 text-left text-sm font-medium text-gray-700">Aksi </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categoryServices.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="max-w-xs truncate px-4 py-2 whitespace-nowrap">{item.description}</TableCell>
                                        <TableCell>{item.start_from}</TableCell>
                                        <TableCell>
                                            <img
                                                src={item.image ? `/storage/${item.image}` : '/placeholder.png'}
                                                alt={item.name}
                                                className="h-25 w-25 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="space-x-2 px-4 py-2 text-center whitespace-nowrap">
                                            <Button variant="secondary" size="sm" onClick={() => handleEdit(item)} title="Edit">
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} title="Hapus">
                                                <Trash2Icon size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <PaginationButtons prevPageUrl={categoryServices.prev_page_url} nextPageUrl={categoryServices.next_page_url} />
                </div>

                {/* Dialog Form Add/Edit */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} disabled={processing} />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    disabled={processing}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="start_from">Start From (harga mulai dari)</Label>
                                <Input
                                    id="start_from"
                                    type="number"
                                    value={data.start_from}
                                    onChange={(e) => setData('start_from', Number(e.target.value))}
                                    disabled={processing}
                                />
                                {errors.start_from && <p className="text-sm text-red-500">{errors.start_from}</p>}
                            </div>

                            <div>
                                <Label htmlFor="image">Upload Gambar</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setData('image', e.target.files[0]);
                                        }
                                    }}
                                    disabled={processing}
                                />
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)} disabled={processing}>
                                    Batal
                                </Button>
                                <Button type="submit" variant="default" disabled={processing}>
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </>
    );
}
