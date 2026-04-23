import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicPageData } from "@/lib/club-content";

export default function TopicPage({
  params,
}: {
  params: { id: string; topicId: string };
}) {
  const groupId = Number.parseInt(params.id, 10);
  const topicId = Number.parseInt(params.topicId, 10);
  const topicPage = getTopicPageData(groupId, topicId);

  if (!topicPage) {
    notFound();
  }

  const { group, topic, links } = topicPage;

  return (
    <div className="min-h-screen bg-[#e9dcc7] text-black">
      <header className="border-b border-black/10 bg-[#e4d4bc]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link
            href={`/home/groups/${groupId}`}
            className="font-mono text-xs uppercase tracking-[0.2em] text-black/70 transition-colors hover:text-black"
          >
            ← Назад к списку тем
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/55">
            {group.title} / {topic.title}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6">
        <section className="border border-black/10 bg-[#f4eadb] px-6 py-8 shadow-[0_18px_50px_rgba(73,52,27,0.08)] sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/45">
            Страница ссылок
          </p>
          <h1 className="mt-3 font-heading text-4xl font-light text-black sm:text-5xl">
            {topic.title}
          </h1>
          <p className="mt-4 max-w-3xl font-body text-sm leading-relaxed text-black/70 sm:text-base">
            Ниже собран список ссылок по этой теме. Для заполненных разделов
            элементы уже ведут на нужные материалы, а остальные можно будет
            заменить позже.
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/50">
              Список ссылок
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
              {links.length} позиций
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {links.map((linkItem) =>
              linkItem.href ? (
                <a
                  key={linkItem.id}
                  href={linkItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-black/10 bg-[#fff8ee] px-4 py-2.5 text-left font-body text-sm text-black transition-colors duration-150 hover:bg-white"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-black/35">
                    {String(linkItem.id).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block leading-snug">
                    {linkItem.title}
                  </span>
                </a>
              ) : (
                <button
                  key={linkItem.id}
                  type="button"
                  className="w-full border border-black/10 bg-[#fff8ee] px-4 py-2.5 text-left font-body text-sm text-black transition-colors duration-150 hover:bg-white"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-black/35">
                    {String(linkItem.id).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block leading-snug">
                    {linkItem.title}
                  </span>
                </button>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
