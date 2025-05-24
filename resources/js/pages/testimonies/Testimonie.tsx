import { Head, useForm, usePage } from '@inertiajs/react';
import { Edit, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import PaginationButtons from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

type Testimonie = {
    id: number;
    rating: string;
    customer_name: string;
    description: string;
    created_at: string;
};

type PageProps = {
    testimonies: {
        data: Testimonie[];
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    total: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimoni User',
        href: 'testimonies',
    },
];

export default function TestimoniUser() {
    const { testimonies, total } = usePage<PageProps>().props;

    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedTestimonie, setSelectedTestimonie] = useState<Testimonie | null>(null);

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
        id: 0,
        customer_name: '',
        description: '',
        rating: '3',
    });

    const handleOpenEdit = (testimonie: Testimonie) => {
        setData({
            id: testimonie.id,
            customer_name: testimonie.customer_name,
            description: testimonie.description,
            rating: testimonie.rating,
        });
        setOpenEdit(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus testimoni ini?')) {
            destroy(`testimonies/${id}`);
        }
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (data) {
            put(`testimonies/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenEdit(false);
                },
            });
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post('testimonies', {
            preserveScroll: true,
            onSuccess: () => {
                setOpenAdd(false);
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Testimoni User" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 p-6">
                    <div className="w-3">
                        <Button variant="default" className="bg-primary text-primary-foreground" onClick={() => setOpenAdd(true)}>
                            Add Testimonie
                        </Button>
                    </div>

                    <div className="mb-4">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Total Testimoni</CardTitle>
                                <CardDescription>{total} Testimonies telah ditambahkan</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonies.data.map((testimonie) => (
                            <Card key={testimonie.id}>
                                <CardHeader>
                                    <CardTitle>{testimonie.customer_name}</CardTitle>
                                    <div className="flex gap-1">
                                        {[...Array(Number(testimonie.rating))].map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-500">Bergabung pada {new Date(testimonie.created_at).toLocaleDateString()}</p>
                                    <p className="mt-2 text-gray-700">{testimonie.description}</p>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button variant="secondary" onClick={() => handleOpenEdit(testimonie)}>
                                        <Edit size={16} />
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(testimonie.id)}>
                                        <Trash2Icon size={16} />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    <PaginationButtons nextPageUrl={testimonies.next_page_url} prevPageUrl={testimonies.prev_page_url} />
                </div>

                {/* Edit Dialog */}
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Testimoni</DialogTitle>
                        </DialogHeader>
                        {data && (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <Label htmlFor="customer_name">Nama Customer</Label>
                                    <Input id="customer_name" value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="rating">Rating</Label>
                                    <div className="flex items-center gap-4">
                                        <Slider
                                            min={1}
                                            max={5}
                                            step={1}
                                            value={[Number(data.rating)]}
                                            onValueChange={(value) => setData('rating', value[0].toString())}
                                        />
                                        <span>{data.rating} ⭐</span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="secondary" onClick={() => setOpenEdit(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" variant="default" disabled={processing}>
                                        Simpan
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Add Dialog */}
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Testimoni</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <Label htmlFor="customer_name">Nama Customer</Label>
                                <Input id="customer_name" value={data.customer_name} onChange={(e) => setData('customer_name', e.target.value)} />
                                {errors.customer_name && <p className="text-sm text-red-500">{errors.customer_name}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>
                            <div>
                                <Label htmlFor="rating">Rating</Label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={[Number(data.rating)]}
                                        onValueChange={(value) => setData('rating', String(value[0]))}
                                    />
                                    <span>{data.rating} ⭐</span>
                                </div>
                                {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="secondary" onClick={() => setOpenAdd(false)}>
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
