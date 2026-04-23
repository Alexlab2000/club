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
  const supabase = await createClient();

  const { data: subgroups } = await supabase
    .from("subgroups")
    .select("id, title, slug, description, icon")
    .order("title");

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <p className="font-mono text-xs text-ghost tracking-[0.3em] uppercase mb-3">
          Добро пожаловать
        </p>
        <h1 className="font-heading text-5xl font-light text-ivory">
          Главная
        </h1>
        <div className="divider-gold w-32 mt-4" />
        <p className="mt-6 max-w-xl font-body text-sm leading-relaxed text-ghost">
          Здесь собраны основные разделы сайта. Личный кабинет доступен отдельно
          по кнопке в шапке.
        </p>
      </div>

      {subgroups && subgroups.length > 0 ? (
        <div>
          <p className="font-mono text-xs text-ghost tracking-[0.2em] uppercase mb-6">
            Разделы
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subgroups.map((group, index) => (
              <SubgroupCard key={group.id} group={group} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-ash py-20 text-center">
          <p className="font-heading text-2xl font-light text-ghost">
            Разделы появятся позже
          </p>
          <p className="mt-3 font-mono text-xs tracking-widest text-ash">
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
      className="group relative block border border-ash bg-coal p-6 transition-all duration-300 hover:border-gold-dark hover:bg-charcoal"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="absolute right-0 top-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(225deg, rgba(201,168,76,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="flex flex-col gap-3">
        {group.icon && <span className="text-2xl">{group.icon}</span>}
        <h3 className="font-heading text-xl font-light text-ivory transition-all group-hover:text-gradient-gold">
          {group.title}
        </h3>
        {group.description && (
          <p className="font-body text-xs leading-relaxed text-ghost">
            {group.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-px flex-1 bg-ash transition-colors group-hover:bg-gold-dark" />
          <span className="font-mono text-xs text-ghost transition-colors group-hover:text-gold">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
