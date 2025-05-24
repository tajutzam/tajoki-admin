import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';

import { usePage } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { props: inertiaProps } = usePage();

    useEffect(() => {
        const flash = inertiaProps.flash as { success?: string; error?: string } | undefined;
        const errors = inertiaProps.errors as unknown as Record<string, string[]> | undefined;

        console.log('flash :', inertiaProps);

        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        if (errors) {
            Object.values(errors).forEach((messages) => {
                if (Array.isArray(messages)) {
                    messages.forEach((msg) => toast.error(msg));
                } else {
                    toast.error(messages);
                }
            });
        }
    }, [inertiaProps]);

    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
            <Toaster richColors position="top-right" />
        </>
    );
};
