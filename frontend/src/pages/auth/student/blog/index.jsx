import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: "learning-roadmap",
    title: "Build a Weekly Learning Roadmap That You Can Actually Follow",
    excerpt:
      "A practical way to plan your study hours, avoid burnout, and finish courses consistently.",
    category: "Learning Tips",
    readTime: "6 min read",
    image: "/study2.png",
  },
  {
    id: "project-first",
    title: "Project-First Learning: The Fastest Way to Keep New Skills",
    excerpt:
      "Why building small projects after each module beats passive watching and note-taking.",
    category: "Career Growth",
    readTime: "5 min read",
    image: "/web-developer.png",
  },
  {
    id: "ai-tools",
    title: "How to Use AI Tools Without Skipping Core Fundamentals",
    excerpt:
      "Use modern AI workflows to move faster while still building real understanding.",
    category: "Productivity",
    readTime: "7 min read",
    image: "/artificial-intelligence.png",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#184EF0]">
            EduNest
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Blog</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Learning strategies, productivity tips, and practical guidance to help
            you get more from every course.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex rounded-md bg-[#184EF0] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123fd0]"
          >
            Back To Dashboard
          </Link>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#184EF0]">
                  {post.category}
                </p>
                <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
                <div className="mt-4 text-xs text-slate-500">{post.readTime}</div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
