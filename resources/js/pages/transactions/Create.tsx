import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { href: '/transactions', title: 'Transactions' },
    { href: '/transactions/create', title: 'Create Transactions' },
];

type CreateTransactionProps = {
    employees: { id: string; name: string }[];
    customers: { id: string; name: string }[];
};

export default function CreateTransaction({ employees, customers }: CreateTransactionProps) {
    const { data, setData, post, processing, errors } = useForm({
        project_name: '',
        description: '',
        customer_id: '',
        deadline: '',
        price: '',
        employee_id: '',
        status: 'dp',
        method_payments: '',
        payment_proof: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/transactions', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Transactions" />

            <Card className="mx-auto my-10 w-full max-w-3xl">
                <CardHeader>
                    <CardTitle>Create New Transaction</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 2 Kolom Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Project Name */}
                            <div>
                                <Label htmlFor="project_name">Project Name</Label>
                                <Input
                                    id="project_name"
                                    value={data.project_name}
                                    onChange={(e) => setData('project_name', e.target.value)}
                                    placeholder="Masukkan nama proyek"
                                />
                                {errors.project_name && <p className="text-sm text-red-500">{errors.project_name}</p>}
                            </div>

                            {/* Description */}

                            {/* Customer */}
                            <div>
                                <Label htmlFor="customer_id">Customer</Label>
                                <Select onValueChange={(value) => setData('customer_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((cust) => (
                                            <SelectItem key={cust.id} value={cust.id}>
                                                {cust.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id}</p>}
                            </div>

                            {/* Employee */}
                            <div>
                                <Label htmlFor="employee_id">Employee</Label>
                                <Select onValueChange={(value) => setData('employee_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.employee_id && <p className="text-sm text-red-500">{errors.employee_id}</p>}
                            </div>

                            {/* Deadline */}
                            <div>
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input id="deadline" type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} />
                                {errors.deadline && <p className="text-sm text-red-500">{errors.deadline}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="Masukkan harga transaksi"
                                />
                                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select onValueChange={(value) => setData('status', value)} defaultValue="dp">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dp">DP</SelectItem>
                                        <SelectItem value="lunas">Lunas</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                            </div>

                            {/* Method Payments */}
                            <div>
                                <Label htmlFor="method_payments">Metode Pembayaran</Label>
                                <Input
                                    id="method_payments"
                                    value={data.method_payments}
                                    onChange={(e) => setData('method_payments', e.target.value)}
                                    placeholder="Transfer / Cash / E-wallet"
                                />
                                {errors.method_payments && <p className="text-sm text-red-500">{errors.method_payments}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Deskripsi transaksi"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Payment Proof (file upload) di bawah sendiri */}
                        <div>
                            <Label htmlFor="payment_proof">Bukti Pembayaran</Label>
                            <Input id="payment_proof" type="file" onChange={(e) => setData('payment_proof', e.target.files?.[0] || null)} />
                            {errors.payment_proof && <p className="text-sm text-red-500">{errors.payment_proof}</p>}
                        </div>

                        <Button type="submit" disabled={processing}>
                            Create Transaction
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
