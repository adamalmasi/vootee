import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="max-w-lg mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Mikor érsz rá?</h1>
      <p className="text-gray-500 text-lg mb-3">
        Időpont-szavazás percek alatt. Regisztráció nélkül, reklám nélkül.
      </p>
      <p className="text-gray-400 text-sm mb-10">
        A szavazóknak nem kell fiókot létrehozni — csak megnyitják a linket és szavaznak.
      </p>
      <Link href="/create"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg px-8 py-3.5 rounded-xl transition">
        Szavazás létrehozása →
      </Link>
    </main>
  )
}
