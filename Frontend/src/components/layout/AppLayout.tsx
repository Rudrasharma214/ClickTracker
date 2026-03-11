import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-900 text-white p-4">
                <h2 className="text-xl font-bold mb-6">ClickTracker</h2>
                <nav className="space-y-2">
                    <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-800">
                        Dashboard
                    </a>
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </header>
                <main className="flex-1 overflow-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
