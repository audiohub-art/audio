import { logout } from '@/app/actions/auth';
import { getAccessToken } from '@/lib/session';

export default async function DashboardPage() {
  const token = await getAccessToken();
  let username = 'User';

  if (token) {
    try {
      // Decode JWT payload without verifying signature (since frontend doesn't have the secret)
      const payloadBase64 = token.split('.')[1];
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);
      username = payload.name || username;
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-4xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back, {username}!</p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl mt-8 p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Protected Content</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This page is protected. If you can see this, you are authenticated.
        </p>
      </div>
    </div>
  );
}
