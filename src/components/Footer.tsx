export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 py-8">
      <div className="mx-auto max-w-4xl px-6 text-sm text-muted">
        © {new Date().getFullYear()} saintjw · made with Next.js
      </div>
    </footer>
  );
}
