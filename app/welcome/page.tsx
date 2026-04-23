import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-obsidian px-6">
      <div className="flex flex-col items-center text-center max-w-sm animate-fade-in">
        {/* Иконка */}
        <div
          className="w-24 h-24 rounded-full border flex items-center justify-center mb-8"
          style={{ borderColor: "rgba(201,168,76,0.4)" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M8 20L16 28L32 12"
              stroke="#c9a84c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-4">
          Добро пожаловать
        </p>

        <h1 className="font-heading text-4xl font-light text-ivory mb-4">
          Вы приняты
        </h1>

        <div className="divider-gold w-24 mb-6" />

        <p className="font-body text-sm text-ghost leading-relaxed mb-10">
          Email подтверждён. Ваш аккаунт активен.
          <br />
          Добро пожаловать в закрытый клуб.
        </p>

        <Link
          href="/home"
          className="w-full py-4 bg-gold text-obsidian font-body text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-all duration-300 text-center block"
        >
          Войти в кабинет →
        </Link>
      </div>
    </main>
  );
}
