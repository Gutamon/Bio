export default function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      {children}
    </main>
  )
}
