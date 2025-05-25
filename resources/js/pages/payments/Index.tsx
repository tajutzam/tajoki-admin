import PaginationButtons from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Payment {
    id: number;
    description: string;
    image: string;
}

interface PaymentProps {
    payments: {
        data: Payment[];
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function PaymentPage({ payments }: PaymentProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Payment | null>(null);

    const {
        data,
        setData,
        reset,
        post,
        processing,
        errors,
        progress,
        setDefaults,
        put,
        delete: destroy,
    } = useForm<{
        description: string;
        image: File | null;
    }>({
        description: '',
        image: null,
    });

    const openCreate = () => {
        reset();
        setEditing(null);
        setShowDialog(true);
    };

    const openEdit = (payment: Payment) => {
        setData({
            description: payment.description,
            image: null,
        });
        setEditing(payment);
        setShowDialog(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('description', data.description);
        if (data.image) formData.append('image', data.image);

        if (editing) {
            formData.append('_method', 'PUT');
            router.post(route('payment-proofs.update', editing.id), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setShowDialog(false);
                },
            });
        } else {
            router.post(route('payment-proofs.store'), formData, {
                forceFormData: true,
                onSuccess: () => {
                    setShowDialog(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            destroy(`/payment-proofs/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ href: '/payments', title: 'Bukti Pembayaran' }]}>
            <div className="mx-5 my-3">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Bukti Pembayaran</h1>
                    <Button onClick={openCreate}>Tambah</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Gambar</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.data.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.description}</TableCell>
                                <TableCell>
                                    <img src={`/storage/${payment.image}`} alt="Bukti" className="h-16 rounded shadow" />
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <Button variant="outline" onClick={() => openEdit(payment)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(payment.id)}>
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <PaginationButtons nextPageUrl={payments.next_page_url} prevPageUrl={payments.prev_page_url} />

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit Bukti Pembayaran' : 'Tambah Bukti Pembayaran'}</DialogTitle>
                                <DialogDescription>{editing ? 'Edit deskripsi dan gambar.' : 'Upload bukti pembayaran baru.'}</DialogDescription>
                            </DialogHeader>

                            <div className="my-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Deskripsi</label>
                                    <Input
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Contoh: Transfer ke BCA"
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Gambar</label>
                                    <Input type="file" onChange={(e) => setData('image', e.target.files?.[0] || null)} />
                                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                                    {progress && <p className="mt-1 text-sm text-gray-500">Uploading: {progress.percentage}%</p>}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {editing ? 'Update' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
