import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroupArticle, getGroupPageData } from "@/lib/club-content";

export default function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const groupId = Number.parseInt(params.id, 10);
  const group = getGroupPageData(groupId);
  const article = getGroupArticle(groupId);

  if (!group) {
    notFound();
  }

  if (article) {
    return (
      <div className="min-h-screen bg-[#e9dcc7] text-black">
        <header className="border-b border-black/10 bg-[#e4d4bc]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <Link
              href="/home"
              className="font-mono text-xs uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black"
            >
              ← Назад на главную
            </Link>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/55">
              {article.eyebrow} / {article.title}
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
          <section className="border border-black/10 bg-[#f4eadb] px-6 py-8 shadow-[0_18px_50px_rgba(73,52,27,0.08)] sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/45">
              {article.eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-light text-black sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 max-w-3xl font-body text-sm leading-relaxed text-black/70 sm:text-base">
              {article.intro}
            </p>
          </section>

          <section className="mt-8 border border-black/10 bg-[#f4eadb] p-4 shadow-[0_18px_50px_rgba(73,52,27,0.08)] sm:p-6">
            {article.imageSrc && (
              <div className="overflow-hidden border border-black/10 bg-[#efe2cf]">
                <Image
                  src={article.imageSrc}
                  alt={article.imageAlt ?? article.title}
                  width={1280}
                  height={720}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose mt-6 max-w-none prose-headings:font-heading prose-headings:font-light prose-p:font-body prose-p:text-[15px] prose-p:leading-7 prose-li:font-body prose-li:text-[15px] prose-li:leading-7 prose-strong:text-black">
              {article.blocks.map((block, index) => (
                <div key={`${block.title ?? block.type}-${index}`} className="mb-8 last:mb-0">
                  {block.title && <h2 className="mb-3 text-2xl text-black">{block.title}</h2>}
                  {block.text && <p>{block.text}</p>}
                  {block.type === "list" && block.items && (
                    <ul className="mt-3 space-y-3 pl-5">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <header className="border-b border-ash px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link
            href="/home"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ghost transition-colors hover:text-ivory"
          >
            ← Назад на главную
          </Link>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ash sm:block">
            {group.sectionTitle} / {group.title}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <section className="animate-fade-in">
          <div className="flex items-start gap-4">
            <span className="mt-1 text-5xl leading-none">{group.icon}</span>
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ghost">
                {group.sectionTitle}
              </p>
              <h1 className="font-heading text-4xl font-light text-ivory sm:text-5xl">
                {group.title}
              </h1>
              <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-ghost sm:text-base">
                {group.description}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-gold/80">
                {group.topics.length} кнопок в вертикальном списке
              </p>
            </div>
          </div>
          <div className="divider-gold mt-6" />
        </section>

        <section className="mt-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
            Содержимое группы
          </p>

          <div className="flex flex-col gap-2">
            {group.topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/home/groups/${groupId}/topics/${topic.id}`}
                className="group flex w-full animate-slide-up items-center gap-4 border border-ash bg-coal px-5 py-4 text-left transition-all duration-150 hover:border-gold/45 hover:bg-charcoal"
                style={{ animationDelay: `${index * 0.035}s`, opacity: 0 }}
              >
                <span className="w-7 flex-shrink-0 font-mono text-xs text-ash transition-colors group-hover:text-gold">
                  {String(topic.id).padStart(2, "0")}
                </span>
                <div className="h-8 w-px flex-shrink-0 bg-ash/60" />
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-light text-ivory transition-colors group-hover:text-gold">
                    {topic.title}
                  </p>
                  <p className="mt-1 font-body text-xs leading-relaxed text-ghost">
                    {topic.description}
                  </p>
                </div>
                <span className="hidden flex-shrink-0 border border-ash/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ash transition-colors group-hover:border-gold/30 group-hover:text-gold/80 sm:block">
                  {topic.tag}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
