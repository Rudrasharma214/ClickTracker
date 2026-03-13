import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
    return (
        <div className="flex flex-1">
            <aside className="w-64 bg-gray-900 text-white p-4 min-h-full">
                <nav className="space-y-2">
                    <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-800">
                        Dashboard
                    </a>
                </nav>
            </aside>
            <main className="flex-1 overflow-auto bg-gray-50 p-6">
                <Outlet />
            </main>
        </div>
    );
};
