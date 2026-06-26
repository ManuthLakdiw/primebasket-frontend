import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {

    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        redirect('/login');
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}