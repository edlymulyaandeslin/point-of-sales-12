import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index({ users }: { users: PaginatedData<User> }) {
    const { props } = usePage<{ users: PaginatedData<User>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>();

    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/users', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = async () => {
        await router.delete(route('users.destroy', selectedUser?.id));
        setOpenDelete(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Pengguna" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Data Pengguna</h2>
                    <Link href="/users/create" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        + Tambah Pengguna
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Cari nama pengguna..."
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <DataTable
                    data={users.data}
                    from={users.from}
                    to={users.to}
                    total={users.total}
                    links={users.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => index,
                        },
                        {
                            title: 'Nama',
                            render: (user) => <span className="font-medium">{user.name}</span>,
                        },
                        {
                            title: 'Email',
                            render: (user) => user.email,
                        },
                        {
                            title: 'Role',
                            render: (user) => (
                                <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                        user.roles[0].name === 'admin'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    }`}
                                >
                                    {user.roles[0].name}
                                </span>
                            ),
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (user) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setOpen(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <Link
                                        href={`/users/${user.id}/edit`}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 transition hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setOpenDelete(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div> 

            {/* modal show */}
            <Modal isOpen={open} onClose={() => setOpen(false)} title="Detail Pengguna" size="lg">
                {selectedUser && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Nama Lengkap</span>
                                <span className="text-base font-semibold">{selectedUser.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                                <span className="text-base">{selectedUser.email}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Role</span>
                                <span
                                    className={`mt-1 w-fit rounded-full px-2 py-1 text-xs font-semibold ${
                                        selectedUser.roles[0].name === 'admin'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    }`}
                                >
                                    {selectedUser.roles[0].name}
                                </span>
                            </div>
                            {/* Tambahan contoh field jika tersedia */}
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">{new Date(selectedUser.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant={'secondary'} onClick={() => setOpen(false)} className="cursor-pointer">
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* modal confirm delete */}
            <Modal
                isOpen={openDelete}
                onClose={() => setOpenDelete(false)}
                title="Konfirmasi Hapus"
                size="sm"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpenDelete(false)} variant={'secondary'} className="cursor-pointer">
                            Batal
                        </Button>
                        <Button onClick={handleDelete} variant={'secondary'} className="cursor-pointer bg-red-700 transition hover:bg-red-800">
                            Hapus
                        </Button>
                    </div>
                }
            >
                 Apakah Anda yakin ingin menghapus user <strong className="text-red-600 dark:text-red-400">{selectedUser?.name}</strong>?
                Tindakan ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
