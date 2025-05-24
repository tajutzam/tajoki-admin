'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Textarea } from '@headlessui/react';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Trash2Icon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Projects',
        href: '/projects',
    },
];

// Static list languages di frontend
const availableLanguages = [
    { id: 'js', name: 'JavaScript' },
    { id: 'ts', name: 'TypeScript' },
    { id: 'py', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'php', name: 'PHP' },
    { id: 'go', name: 'Go' },
];

type CategoryDropdown = {
    id: number;
    name: string;
};

type CategoryService = {
    id: number;
    name: string;
    description: string;
    start_from: number;
    image: string | File | null;
};

type ProjectsData = {
    id: number;
    description: string;
    image_poster: string;
    category_service_id: number;
    category: CategoryService;
    is_published: boolean;
    title: string;
    languages?: string; // comma separated string
    price?: number;
};

type ProjectsProps = {
    projects: {
        data: ProjectsData[];
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    categories: CategoryDropdown[];
    total: number;
};

export default function Projects() {
    const { projects, total, categories } = usePage<ProjectsProps>().props;
    const [openAdd, setOpenAdd] = useState(false);

    const [formData, setFormData] = useState({
        id: null as number | null,
        title: '',
        description: '',
        category_service_id: '',
        image_poster: null as File | null,
        is_published: false,
        languages: [] as string[],
        price: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            image_poster: e.target.files?.[0] || null,
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            category_service_id: value,
        }));
    };

    const handleLanguageToggle = (langId: string) => {
        setFormData((prev) => {
            const langs = [...prev.languages];
            if (langs.includes(langId)) {
                return { ...prev, languages: langs.filter((id) => id !== langId) };
            } else {
                langs.push(langId);
                return { ...prev, languages: langs };
            }
        });
    };

    const handleSubmit = () => {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category_service_id', formData.category_service_id);
        data.append('is_published', formData.is_published ? '1' : '0');
        data.append('languages', formData.languages.join(','));
        data.append('price', formData.price);
        if (formData.image_poster) {
            data.append('image_poster', formData.image_poster);
        }

        if (isEditing && formData.id) {
            data.append('_method', 'put');
            router.post(`/projects/${formData.id}`, data, {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                },
            });
        } else {
            router.post('/projects', data, {
                forceFormData: true,
                onSuccess: () => {
                    resetForm();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus project ini?')) {
            router.delete(`/projects/${id}`);
        }
    };

    const openEditDialog = (project: ProjectsData) => {
        setFormData({
            id: project.id,
            title: project.title,
            description: project.description,
            category_service_id: String(project.category_service_id),
            image_poster: null,
            is_published: project.is_published,
            languages: project.languages ? project.languages.split(',') : [],
            price: project.price ? String(project.price) : '',
        });
        setIsEditing(true);
        setOpenAdd(true);
    };

    const resetForm = () => {
        setFormData({
            id: null,
            title: '',
            description: '',
            category_service_id: '',
            image_poster: null,
            is_published: false,
            languages: [],
            price: '',
        });
        setIsEditing(false);
        setOpenAdd(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects List" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <Button variant="default" className="bg-primary text-primary-foreground" onClick={() => setOpenAdd(true)}>
                        + Add Project
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Project</CardTitle>
                        <CardDescription>{total} projects telah ditambahkan</CardDescription>
                    </CardHeader>
                </Card>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {projects.data.map((project) => (
                        <Card key={project.id} className="cursor-pointer overflow-hidden p-0">
                            <img src={project.image_poster} alt={project.title} className="h-40 w-full object-cover" />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{project.title}</h2>
                                <p className="line-clamp-3 text-sm text-gray-600">{project.description}</p>
                                <p className="mt-2 text-sm font-medium text-indigo-600">{project.category.name}</p>
                                <p className="text-xs text-gray-500">{project.is_published ? 'Published' : 'Draft'}</p>
                                <p className="mt-1 text-xs text-gray-400">Languages: {project.languages ? project.languages : '-'}</p>
                                <p className="mt-1 text-xs text-gray-400">Price: {project.price ?? '-'}</p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(project.id);
                                        }}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditDialog(project);
                                        }}
                                    >
                                        <Edit />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Project' : 'Tambah Project'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full rounded border p-2"
                            placeholder="Judul Project"
                        />

                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full rounded border p-2"
                            placeholder="Deskripsi Project"
                        />

                        <Select onValueChange={handleCategoryChange} value={formData.category_service_id}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    {categories.map((value) => (
                                        <SelectItem key={value.id} value={value.id.toString()}>
                                            {value.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Languages</label>
                            <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded border p-2">
                                {availableLanguages.map((lang) => (
                                    <label key={lang.id} className="flex cursor-pointer items-center space-x-2 select-none">
                                        <Input
                                            type="checkbox"
                                            value={lang.id}
                                            checked={formData.languages.includes(lang.id)}
                                            onChange={() => handleLanguageToggle(lang.id)}
                                        />
                                        <span>{lang.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full rounded border p-2"
                            placeholder="Price"
                        />

                        <Input type="file" name="image_poster" onChange={handleFileChange} className="w-full" />

                        <label className="inline-flex items-center space-x-2">
                            <Input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleInputChange} />
                            <span>Publish</span>
                        </label>

                        <div className="text-right">
                            <Button onClick={() => setOpenAdd(false)} variant="outline">
                                Cancel
                            </Button>
                            <Button className="ml-2" onClick={handleSubmit}>
                                Simpan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
