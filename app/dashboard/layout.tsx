import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const userEmail = user.email ?? "";

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Верхняя панель */}
      <header className="border-b border-ash bg-coal sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            >
              <svg width="14" height="14" viewBox="0 0 36 36" fill="none">
                <path
                  d="M18 3L33 30H3L18 3Z"
                  stroke="#c9a84c"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <span
              className="font-heading text-xl tracking-[0.2em] text-ivory"
            >
              КЛУБ
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-ghost hidden sm:block">
              {userEmail}
            </span>
            <Link
              href="/home"
              className="font-mono text-xs text-ghost tracking-widest uppercase hover:text-ivory transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/dashboard/account"
              className="font-mono text-xs text-ghost tracking-widest uppercase hover:text-ivory transition-colors"
            >
              Кабинет
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Контент страницы */}
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}

// Кнопка выхода — клиентский компонент внутри серверного layout
function LogoutButton() {
  return (
    <form action="/api/logout" method="POST">
      <button
        type="submit"
        className="font-mono text-xs text-ghost tracking-widest uppercase hover:text-ivory transition-colors"
      >
        Выйти
      </button>
    </form>
  );
}
