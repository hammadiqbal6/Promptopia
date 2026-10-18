const AuthBanner = () => {
  return (
    <div
      role="status"
      className="mb-8 w-full max-w-3xl rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-3 text-center text-xs text-amber-900 sm:px-4 sm:text-sm"
    >
      Google sign-in is not configured. You can browse prompts; to enable
      create/edit, add{" "}
      <code className="font-mono text-xs">GOOGLE_CLIENT_ID</code> and{" "}
      <code className="font-mono text-xs">GOOGLE_CLIENT_SECRET</code> to{" "}
      <code className="font-mono text-xs">.env.local</code> (see README).
    </div>
  );
};

export default AuthBanner;
