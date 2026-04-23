"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CLUB_SECTIONS } from "@/lib/club-content";

type HomePageClientProps = {
  formattedDate: string;
  userEmail: string | null;
};

export default function HomePageClient({
  formattedDate,
  userEmail,
}: HomePageClientProps) {
  const router = useRouter();
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});
  const [activeSectionId, setActiveSectionId] = useState(
    CLUB_SECTIONS[0]?.id ?? 1
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const id = Number(visibleEntry.target.getAttribute("data-section-id"));
        if (Number.isFinite(id)) {
          setActiveSectionId(id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.35, 0.5],
      }
    );

    const elements = Object.values(sectionRefs.current).filter(
      (value): value is HTMLElement => Boolean(value)
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  function scrollToSection(sectionId: number) {
    setActiveSectionId(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <header className="relative overflow-hidden">
        <div className="relative h-[216px] w-full sm:h-[264px] lg:h-[312px]">
          <Image
            src="/hero-banner.png"
            alt="Космический баннер клуба"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 42%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(4,7,14,0.18) 0%, rgba(4,7,14,0.42) 40%, rgba(10,10,10,0.92) 100%)",
            }}
          />
          <div className="absolute inset-0 z-10 flex items-start justify-between gap-4 px-4 pt-3 sm:px-6 sm:pt-4">
            <div
              className="max-w-[320px] border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-md sm:max-w-[420px] sm:px-5"
              style={{ boxShadow: "0 18px 60px rgba(0,0,0,0.25)" }}
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-gold/75">
                Навигация по клубу
              </p>
              <h1 className="font-heading text-2xl font-light text-ivory sm:text-4xl">
                Карта закрытого пространства
              </h1>
              <p className="mt-2 max-w-md font-body text-[11px] leading-relaxed text-silver sm:text-xs">
                Баннер, быстрый доступ к группам и дерево разделов справа. Это
                новая витрина домашней страницы после входа.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push("/dashboard/account")}
                className="border border-gold/30 bg-black/45 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-gold/15"
              >
                Личный кабинет
              </button>
              <button
                onClick={handleLogout}
                className="border border-white/15 bg-black/45 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory/85 backdrop-blur-sm transition-all hover:border-red-400/45 hover:bg-red-900/20 hover:text-red-200"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="border-y border-gold/15 bg-[rgba(12,16,28,0.78)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-ghost">
            Техническая строка-заглушка: здесь позже можно поставить новости клуба,
            расписание недели или короткий манифест.
          </p>
          <span className="hidden flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ash sm:block">
            {formattedDate}
          </span>
        </div>
      </div>

      <main className="mx-auto grid max-w-[1600px] gap-10 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:px-6 lg:py-10">
        <div className="min-w-0">
          {CLUB_SECTIONS.map((section, sectionIndex) => (
            <section
              key={section.id}
              ref={(element) => {
                sectionRefs.current[section.id] = element;
              }}
              data-section-id={section.id}
              className="mb-12 scroll-mt-6 animate-slide-up"
              style={{ animationDelay: `${sectionIndex * 0.06}s`, opacity: 0 }}
            >
              <div className="mb-5 flex items-center gap-3 border-b border-ash pb-3">
                <div
                  className="h-5 w-1 rounded-full"
                  style={{ background: section.color.replace("0.14", "0.9") }}
                />
                <h2 className="font-heading text-2xl font-light tracking-[0.12em] text-ivory sm:text-3xl">
                  {section.title}
                </h2>
                <span className="ml-auto hidden border border-ash px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ghost sm:block">
                  {section.groups.length} групп
                </span>
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4" style={{ minWidth: "max-content" }}>
                  {section.groups.map((group, groupIndex) => (
                    <Link
                      key={group.id}
                      href={`/home/groups/${group.id}`}
                      className="group relative flex h-[150px] w-[170px] flex-shrink-0 flex-col justify-between overflow-hidden border border-ash bg-coal/90 p-4 transition-all duration-200 hover:border-gold/45 hover:bg-charcoal"
                      style={{
                        boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
                        animationDelay: `${groupIndex * 0.04}s`,
                      }}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-px opacity-60"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${section.color.replace("0.14", "0.85")}, transparent)`,
                        }}
                      />
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-2xl leading-none">{group.icon}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      </div>
                      <div>
                        <h3 className="font-body text-sm font-light leading-snug text-ivory transition-colors group-hover:text-gold">
                          {group.title}
                        </h3>
                        <p className="mt-2 max-h-[3.9rem] overflow-hidden font-body text-xs leading-relaxed text-ghost">
                          {group.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 border border-ash bg-coal/70 p-5 backdrop-blur-md">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-ash">
              Дерево навигации
            </p>

            <nav className="space-y-4">
              {CLUB_SECTIONS.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="group flex w-full items-center gap-3 text-left"
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-all ${
                        activeSectionId === section.id
                          ? "bg-gold shadow-[0_0_10px_rgba(201,168,76,0.45)]"
                          : "bg-ash group-hover:bg-gold-dark"
                      }`}
                    />
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                        activeSectionId === section.id
                          ? "text-gold"
                          : "text-ghost group-hover:text-ivory"
                      }`}
                    >
                      {section.title}
                    </span>
                  </button>

                  <div className="ml-5 mt-2 space-y-1 border-l border-ash/60 pl-4">
                    {section.groups.map((group) => (
                      <Link
                        key={group.id}
                        href={`/home/groups/${group.id}`}
                        className="flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-ash transition-colors hover:text-gold"
                      >
                        <span className="text-[8px] text-gold/50">→</span>
                        {group.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-6 border-t border-ash pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
                Участник
              </p>
              <p className="mt-2 truncate font-mono text-[11px] text-ghost">
                {userEmail ?? "—"}
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
