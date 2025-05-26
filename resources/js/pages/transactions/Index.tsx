import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React, { Component } from 'react';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        href: '/transactions',
        title: 'Transactions',
    },
];

type Transaction = {
    id: number;
    project_name: string;
    description: string;
    customer: { id: number; name: string };
    deadline: string;
    price: number;
    employee: { id: number; name: string };
    payment_proof: string;
    method_payments: string;
    status_tr: string;
    status: string;
};

interface IndexProps {
    transactions: Transaction[];
    customers: { id: number; name: string }[];
    employees: { id: number; name: string }[];
}

interface IndexState {
    search: string;
    selectedCustomerId: string;
    selectedEmployeeId: string;
    selectedMonth: string;
    selectedYear: string;
    filteredTransactions: Transaction[];
    zoomImage: string | null;
}

export class Index extends Component<IndexProps, IndexState> {
    constructor(props: IndexProps) {
        super(props);

        this.state = {
            search: '',
            selectedCustomerId: 'all',
            selectedEmployeeId: 'all',
            selectedMonth: 'all',
            selectedYear: 'all',
            filteredTransactions: props.transactions || [],
            zoomImage: null,
        };
    }

    applyFilters = () => {
        const { search, selectedCustomerId, selectedEmployeeId, selectedMonth, selectedYear } = this.state;

        let filtered = this.props.transactions;

        // Filter by project_name search
        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            filtered = filtered.filter((trx) => trx.project_name.toLowerCase().includes(lowerSearch));
        }

        // Filter by customer
        if (selectedCustomerId !== 'all') {
            filtered = filtered.filter((trx) => trx.customer.id === Number(selectedCustomerId));
        }

        // Filter by employee
        if (selectedEmployeeId !== 'all') {
            filtered = filtered.filter((trx) => trx.employee.id === Number(selectedEmployeeId));
        }

        // Filter by month
        if (selectedMonth !== 'all') {
            filtered = filtered.filter((trx) => {
                const trxMonth = new Date(trx.deadline).getMonth() + 1; // getMonth() 0-based
                return trxMonth === Number(selectedMonth);
            });
        }

        // Filter by year
        if (selectedYear !== 'all') {
            filtered = filtered.filter((trx) => {
                const trxYear = new Date(trx.deadline).getFullYear();
                return trxYear === Number(selectedYear);
            });
        }

        this.setState({ filteredTransactions: filtered });
    };

    handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ search: e.target.value }, this.applyFilters);
    };

    handleCustomerChange = (value: string) => {
        this.setState({ selectedCustomerId: value }, this.applyFilters);
    };

    handleEmployeeChange = (value: string) => {
        this.setState({ selectedEmployeeId: value }, this.applyFilters);
    };

    handleMonthChange = (value: string) => {
        this.setState({ selectedMonth: value }, this.applyFilters);
    };

    handleYearChange = (value: string) => {
        this.setState({ selectedYear: value }, this.applyFilters);
    };

    handleShow = (id: number) => {
        alert(`Show transaksi dengan id: ${id}`);
    };

    handleEdit = (id: number) => {
        alert(`Edit transaksi dengan id: ${id}`);
    };

    handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            alert(`Delete transaksi dengan id: ${id}`);
        }
    };

    openZoom = (imageUrl: string) => {
        this.setState({ zoomImage: imageUrl });
    };

    closeZoom = () => {
        this.setState({ zoomImage: null });
    };

    render() {
        const { search, selectedCustomerId, selectedEmployeeId, selectedMonth, selectedYear, filteredTransactions, zoomImage } = this.state;
        const { customers, employees } = this.props;

        // Membuat daftar tahun: 5 tahun terakhir termasuk tahun ini
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

        const months = [
            { value: '1', label: 'Januari' },
            { value: '2', label: 'Februari' },
            { value: '3', label: 'Maret' },
            { value: '4', label: 'April' },
            { value: '5', label: 'Mei' },
            { value: '6', label: 'Juni' },
            { value: '7', label: 'Juli' },
            { value: '8', label: 'Agustus' },
            { value: '9', label: 'September' },
            { value: '10', label: 'Oktober' },
            { value: '11', label: 'November' },
            { value: '12', label: 'Desember' },
        ];

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="DATA ORDER" />

                <div className="space-y-4 p-6">
                    <h1 className="text-2xl font-semibold">Data Order</h1>

                    <div className="flex flex-wrap gap-4">
                        <Card className="min-w-[220px] flex-1">
                            <CardHeader>
                                <CardTitle>Total Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-3xl font-bold">{filteredTransactions.length}</CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="min-w-[220px] flex-1">
                            <CardHeader>
                                <CardTitle>Total Pendapatan Kotor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-3xl font-bold">
                                    {filteredTransactions
                                        .reduce((sum, trx) => sum + trx.price, 0)
                                        .toLocaleString('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        })}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>

                    <Input
                        type="text"
                        placeholder="Cari project name..."
                        value={search}
                        onChange={this.handleSearchChange}
                        className="max-w-md flex-grow"
                    />

                    <div className="mb-4 grid grid-cols-2 items-center gap-4">
                        <Select value={selectedCustomerId} onValueChange={this.handleCustomerChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Customer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ALL</SelectItem>
                                {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={String(customer.id)}>
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedEmployeeId} onValueChange={this.handleEmployeeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Employee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ALL</SelectItem>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={String(employee.id)}>
                                        {employee.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedMonth} onValueChange={this.handleMonthChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ALL</SelectItem>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedYear} onValueChange={this.handleYearChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ALL</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Link href="/transactions/create">
                        <Button className="mb-5" variant={'secondary'} size={'default'}>
                            Tambah Order
                        </Button>
                    </Link>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Deadline</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Payment Proof</TableHead>
                                    <TableHead>Method Payments</TableHead>
                                    <TableHead>Status Payment</TableHead>
                                    <TableHead>Status Transaksi</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((trx) => (
                                        <TableRow key={trx.id}>
                                            <TableCell>{trx.project_name}</TableCell>
                                            <TableCell>{trx.description}</TableCell>
                                            <TableCell>{trx.customer.name}</TableCell>
                                            <TableCell>{new Date(trx.deadline).toLocaleDateString('id-ID')}</TableCell>
                                            <TableCell>
                                                {trx.price.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                })}
                                            </TableCell>
                                            <TableCell>{trx.employee.name}</TableCell>
                                            <TableCell>
                                                {trx.payment_proof ? (
                                                    <img
                                                        src={'/storage/' + trx.payment_proof}
                                                        alt="Payment Proof"
                                                        className="max-w-[80px] cursor-pointer rounded-md"
                                                        onClick={() => this.openZoom('/storage/' + trx.payment_proof)}
                                                    />
                                                ) : (
                                                    <Badge variant="secondary">Tidak Ada</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{trx.method_payments}</TableCell>
                                            <TableCell>
                                                <Badge>{trx.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        trx.status_tr === 'done'
                                                            ? 'bg-green-500 text-white'
                                                            : trx.status_tr === 'cancel'
                                                              ? 'bg-red-500 text-white'
                                                              : 'bg-gray-500 text-white'
                                                    }
                                                >
                                                    {trx.status_tr}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="space-x-2">
                                                <Button size="sm" onClick={() => this.handleShow(trx.id)}>
                                                    Show
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => this.handleEdit(trx.id)}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => this.handleDelete(trx.id)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-6 text-center">
                                            Data transaksi tidak ditemukan
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Modal Zoom Image */}
                    {zoomImage && (
                        <div
                            onClick={this.closeZoom}
                            className="bg-opacity-70 fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black"
                        >
                            <img src={zoomImage} alt="Zoomed" className="max-h-[90vh] max-w-[90vw] rounded-md" />
                        </div>
                    )}
                </div>
            </AppLayout>
        );
    }
}

export default Index;
