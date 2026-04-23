import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: { subgroup: string };
}

export default async function SubgroupPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data: subgroup } = await supabase
    .from("subgroups")
    .select("id, title, slug, description, icon, content")
    .eq("slug", params.subgroup)
    .single();

  if (!subgroup) {
    notFound();
  }

  const safeContent = subgroup.content ? sanitizeHtml(subgroup.content) : null;

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <Link
          href="/home"
          className="font-mono text-xs text-ghost tracking-widest uppercase hover:text-ivory transition-colors flex items-center gap-2 mb-8"
        >
          ← Назад
        </Link>
        <div className="flex items-center gap-4 mb-4">
          {subgroup.icon && (
            <span className="text-3xl">{subgroup.icon}</span>
          )}
          <h1 className="font-heading text-5xl font-light text-ivory">
            {subgroup.title}
          </h1>
        </div>
        <div className="divider-gold w-32 mt-4" />
        {subgroup.description && (
          <p className="font-body text-sm text-ghost mt-6 max-w-xl leading-relaxed">
            {subgroup.description}
          </p>
        )}
      </div>

      <div className="border border-ash bg-coal p-8">
        {safeContent ? (
          <div
            className="prose prose-invert max-w-none font-body text-sm text-silver leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        ) : (
          <p className="font-mono text-xs text-ash tracking-widest text-center py-10">
            Контент этого раздела появится позже
          </p>
        )}
      </div>
    </div>
  );
}
