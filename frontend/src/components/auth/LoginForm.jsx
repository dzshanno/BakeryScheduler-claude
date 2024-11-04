<form onSubmit={handleLogin} className="space-y-4">
    {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
        </div>
    )}
    <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
        />
    </div>
    <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
    </div>
    <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
        Log In
    </button>
</form>