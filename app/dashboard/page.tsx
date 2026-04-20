import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface Subgroup {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subgroups } = await supabase
    .from("subgroups")
    .select("id, title, slug, description, icon")
    .order("title");

  const greeting = getGreeting();

  return (
    <div className="animate-fade-in">
      {/* Приветствие */}
      <div className="mb-12">
        <p className="font-mono text-xs text-ghost tracking-[0.3em] uppercase mb-3">
          {greeting}
        </p>
        <h1 className="font-heading text-5xl font-light text-ivory">
          Личный кабинет
        </h1>
        <div className="divider-gold w-32 mt-4" />
      </div>

      {/* Секции */}
      {subgroups && subgroups.length > 0 ? (
        <div>
          <p className="font-mono text-xs text-ghost tracking-[0.2em] uppercase mb-6">
            Разделы
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subgroups.map((group, i) => (
              <SubgroupCard
                key={group.id}
                group={group}
                index={i}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-ash">
          <p className="font-heading text-2xl font-light text-ghost">
            Разделы появятся позже
          </p>
          <p className="font-mono text-xs text-ash tracking-widest mt-3">
            Следите за обновлениями
          </p>
        </div>
      )}
    </div>
  );
}

function SubgroupCard({
  group,
  index,
}: {
  group: Subgroup;
  index: number;
}) {
  return (
    <Link
      href={`/dashboard/${group.slug}`}
      className="group relative block p-6 border border-ash bg-coal hover:border-gold-dark transition-all duration-300 hover:bg-charcoal"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Угловой акцент */}
      <div
        className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(225deg, rgba(201,168,76,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="flex flex-col gap-3">
        {group.icon && (
          <span className="text-2xl">{group.icon}</span>
        )}
        <h3 className="font-heading text-xl font-light text-ivory group-hover:text-gradient-gold transition-all">
          {group.title}
        </h3>
        {group.description && (
          <p className="font-body text-xs text-ghost leading-relaxed">
            {group.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-ash group-hover:bg-gold-dark transition-colors" />
          <span className="font-mono text-xs text-ghost group-hover:text-gold transition-colors">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return "Доброй ночи";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}
