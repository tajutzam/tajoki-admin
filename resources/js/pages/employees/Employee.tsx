import PaginationButtons from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Worker {
    id: number;
    name: string;
    phone_number: string;
}

interface WorkerProps {
    data: {
        workers: Worker[];
        // total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
}

export default function Employee({ data }: WorkerProps) {
    const [showDialog, setShowDialog] = useState(false);
    const [editing, setEditing] = useState<Worker | null>(null);

    const {
        data: formData,
        setData,
        reset,
        post,
        put,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        name: '',
        phone_number: '',
    });

    const openCreate = () => {
        reset();
        setEditing(null);
        setShowDialog(true);
    };

    const openEdit = (worker: Worker) => {
        setData({
            name: worker.name,
            phone_number: worker.phone_number,
        });
        setEditing(worker);
        setShowDialog(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            put(`/employees/${editing.id}`, {
                onSuccess: () => setShowDialog(false),
            });
        } else {
            post('/employees', {
                onSuccess: () => setShowDialog(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus worker ini?')) {
            destroy(`/employees/${id}`);
        }
    };

    console.log(data)

    return (
        <AppLayout breadcrumbs={[{ href: '/employees', title: 'Daftar Worker TAJOKI' }]}>
            <div className="mx-5 my-3">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Daftar Worker</h1>
                    <Button onClick={openCreate}>Tambah Worker</Button>
                </div>

                {/* <p className="text-muted-foreground mb-4 text-sm">
                    Total Worker: <strong>{data.total}</strong>
                </p> */}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Nomor HP</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.workers.map((worker) => (
                            <TableRow key={worker.id}>
                                <TableCell>{worker.name}</TableCell>
                                <TableCell>{worker.phone_number}</TableCell>
                                <TableCell className="space-x-2">
                                    <Button variant="outline" onClick={() => openEdit(worker)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(worker.id)}>
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <PaginationButtons nextPageUrl={data.next_page_url} prevPageUrl={data.prev_page_url} />

                {/* Dialog Add/Edit */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit Worker' : 'Tambah Worker'}</DialogTitle>
                                <DialogDescription>
                                    {editing ? 'Ubah informasi worker berikut.' : 'Tambahkan worker baru ke sistem.'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Nama</label>
                                    <Input value={formData.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama Worker" />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Nomor HP</label>
                                    <Input
                                        value={formData.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        placeholder="081234567890"
                                    />
                                    {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
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
