import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-center p-8">
            <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found or In Development</h2>
            <p className="text-gray-600 mb-6 max-w-md">
                Oops! The page you are looking for does not exist or is still being built. Please check back later or return to the dashboard.
            </p>
            <Link href="/dashboard">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition font-semibold">
                    Go to Dashboard
                </button>
            </Link>
        </div>
    );
} 