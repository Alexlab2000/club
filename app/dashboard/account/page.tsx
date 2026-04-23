import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const userEmail = user.email ?? "";

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-ghost">
          Личный кабинет
        </p>
        <h1 className="font-heading text-5xl font-light text-ivory">
          Профиль
        </h1>
        <div className="divider-gold mt-4 w-32" />
      </div>

      <div className="border border-ash bg-coal p-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ghost">
              Email
            </p>
            <p className="mt-2 font-body text-base text-ivory">{userEmail}</p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ghost">
              Статус
            </p>
            <p className="mt-2 font-body text-base text-ivory">
              Аккаунт активен
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ghost">
              Примечание
            </p>
            <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-ghost">
              Это второстепенная страница профиля. Основная навигация по сайту
              находится на странице «Главная».
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
