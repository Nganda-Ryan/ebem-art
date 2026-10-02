import {
  ArticleRowActions,
  NewArticleButton,
} from "@/components/admin/ArticleRowActions";
import { getAllArticles } from "@/modules/articles";

export const metadata = { title: "Articles - EBEM Admin" };
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Articles</h1>
        <NewArticleButton />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Auteur</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Aucun article. Créez-en un pour le publier sur le site.
                </td>
              </tr>
            )}
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <span className="inline-flex items-center gap-3">
                    {article.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverUrl}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-[10px] text-gray-400">
                        —
                      </span>
                    )}
                    {article.title}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{article.category}</td>
                <td className="px-4 py-3 text-gray-500">{article.authorName}</td>
                <td className="px-4 py-3">
                  {article.published ? (
                    <span className="text-emerald-600">Publié</span>
                  ) : (
                    <span className="text-amber-600">Brouillon</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ArticleRowActions
                    article={{
                      id: article.id,
                      title: article.title,
                      slug: article.slug,
                      excerpt: article.excerpt,
                      body: article.body,
                      category: article.category,
                      coverUrl: article.coverUrl,
                      authorName: article.authorName,
                      published: article.published,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
