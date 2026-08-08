import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="lumi-card max-w-md space-y-3 p-6 text-center">
        <h1 className="m-0 text-2xl font-bold">Page not found</h1>
        <p className="m-0 text-[color:var(--muted)]">That page is not part of Lumi.</p>
        <Link className="lumi-btn lumi-btn-primary inline-flex" href="/">
          Go home
        </Link>
      </div>
    </main>
  );
}
