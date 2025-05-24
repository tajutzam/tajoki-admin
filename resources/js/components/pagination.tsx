import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

type PaginationButtonsProps = {
    prevPageUrl: string | null;
    nextPageUrl: string | null;
};

export default function PaginationButtons({ prevPageUrl, nextPageUrl }: PaginationButtonsProps) {
    return (
        <div className="mt-4 flex justify-end gap-2">
            {prevPageUrl && (
                <Link href={prevPageUrl}>
                    <Button variant="outline">Sebelumnya</Button>
                </Link>
            )}
            {nextPageUrl && (
                <Link href={nextPageUrl}>
                    <Button variant="outline">Selanjutnya</Button>
                </Link>
            )}
        </div>
    );
}
