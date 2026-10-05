import { loadDesk, saveDesk, signIn } from "./actions";
import { adminGate, type DeskBudget, type DeskPost, type DeskSource } from "./gate";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

const errors: Record<string, string> = {
  unauthorized: "That token was not accepted.",
  no_token: "Set PARTOVIO_ADMIN_TOKEN on the site process. This page does not store a key.",
  unreachable: "The catalog API did not answer.",
  bad_slug: "A slug uses lowercase letters, numbers, and hyphens, up to 80 characters.",
  bad_post: "Each article needs a unique slug, a title, and at least one paragraph.",
  bad_limit: "A daily limit is a whole number from 1 to 1000. An empty limit is stored as 10.",
  too_many_posts: "The blog holds at most 20 articles.",
  bad_desk: "The desk could not be read.",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const gate = adminGate();
  const loaded = gate === "missing" ? null : await loadDesk();
  const signedOut = gate === "sign-in" && loaded?.ok === false && loaded.status === 401;

  return (
    <main className="wrap">
      <h1>Admin</h1>
      <p className="lede note">
        Three parser slots, two web-discovery slots, and daily limits for Sly, Codex, and part pictures.
        Turning a slot on records the choice. This build does not crawl the web and does not call those providers.
        Keys stay in the server environment and are not written into this form.
        A generated picture is never shown as a manufacturer photo.
      </p>
      {params.saved === "1" && <p className="demo">Saved. The switches are recorded. Nothing was fetched.</p>}
      {params.error && <p className="error">{errors[params.error] || "The desk was not saved."}</p>}
      {gate === "missing" && <p className="error">{errors.no_token}</p>}
      {signedOut && <SignIn />}
      {loaded?.ok === false && !signedOut && gate !== "missing" && (
        <p className="error">{loaded.status === 0 ? errors.unreachable : "The desk could not be loaded."}</p>
      )}
      {loaded?.ok && <DeskForm desk={loaded.desk} openDemo={gate === "open"} />}
    </main>
  );
}

function SignIn() {
  return (
    <form className="panel stack" action={signIn}>
      <h2>Admin token</h2>
      <p className="muted">The token is checked on this site and is not stored in the catalog.</p>
      <label className="field">
        Token
        <input name="token" type="password" autoComplete="current-password" required />
      </label>
      <button className="primary" type="submit">Open</button>
    </form>
  );
}

function DeskForm({
  desk,
  openDemo,
}: {
  desk: {
    parse: DeskSource[];
    discover: DeskSource[];
    sly: DeskBudget;
    codex: DeskBudget;
    images: DeskBudget;
    posts: DeskPost[];
    views: { path: string; count: number }[] | null;
  };
  openDemo: boolean;
}) {
  const posts = desk.posts || [];
  const extra = posts.length < 20 ? 1 : 0;
  return (
    <form className="stack" action={saveDesk}>
      {openDemo && (
        <p className="demo">
          Demo mode. This page is open because no admin token is set. Set PARTOVIO_ADMIN_TOKEN before a public host.
        </p>
      )}
      <section className="panel">
        <h2>Parser slots</h2>
        <p className="muted">Feeds the catalog is allowed to read. A name is a label. Nothing is fetched from this page.</p>
        <div className="admin-sources">
          {desk.parse.map((source, index) => (
            <SourceFields key={`parse-${index}`} prefix="parse" index={index} source={source} />
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Web discovery</h2>
        <p className="muted">Places a later job may look for a part number. This build does not search the internet.</p>
        <div className="admin-sources">
          {desk.discover.map((source, index) => (
            <SourceFields key={`discover-${index}`} prefix="discover" index={index} source={source} />
          ))}
        </div>
      </section>
      <BudgetFields
        name="sly"
        label="Sly"
        hint="Sly may clarify a part record later. The limit is how many parts a day may be reserved. The default is 10."
        budget={desk.sly}
      />
      <BudgetFields
        name="codex"
        label="Codex"
        hint="An optional second pass on the same record, with its own daily limit."
        budget={desk.codex}
      />
      <BudgetFields
        name="images"
        label="Part pictures"
        hint="Image generation has its own daily limit. A generated picture is never labeled as a manufacturer photo."
        budget={desk.images}
      />
      <section className="panel stack">
        <h2>Blog</h2>
        <p className="muted">These articles are the public blog. Separate paragraphs with a blank line. Leave the last row empty unless you are adding one.</p>
        {Array.from({ length: posts.length + extra }, (_, index) => {
          const post = posts[index];
          return <PostFields key={post?.slug || `new-${index}`} index={index} post={post} />;
        })}
      </section>
      <section className="panel">
        <h2>Page views</h2>
        <p className="muted">Counted by the site. The admin page is not counted. Query strings are dropped.</p>
        {(desk.views || []).length === 0 && <p>No page views yet.</p>}
        {(desk.views || []).length > 0 && (
          <div className="wide">
            <table>
              <thead>
                <tr><th>Path</th><th>Views</th></tr>
              </thead>
              <tbody>
                {(desk.views || []).map((view) => (
                  <tr key={view.path}><td className="mpn">{view.path}</td><td>{view.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <button className="primary" type="submit">Save desk</button>
    </form>
  );
}

function SourceFields({ prefix, index, source }: { prefix: string; index: number; source: DeskSource }) {
  return (
    <div className="admin-source">
      <label className="field">
        Name
        <input name={`${prefix}_name_${index}`} defaultValue={source.name} maxLength={80} />
      </label>
      <label className="check">
        <input type="checkbox" name={`${prefix}_on_${index}`} defaultChecked={source.enabled} />
        On
      </label>
    </div>
  );
}

function BudgetFields({ name, label, hint, budget }: { name: string; label: string; hint: string; budget: DeskBudget }) {
  return (
    <section className="panel">
      <h2>{label}</h2>
      <p className="muted">{hint}</p>
      <label className="check">
        <input type="checkbox" name={`${name}_on`} defaultChecked={budget.enabled} />
        On
      </label>
      <label className="field">
        Daily limit
        <input name={`${name}_limit`} type="number" min={1} max={1000} defaultValue={budget.daily_limit || 10} />
      </label>
      <p className="muted">
        Used today: {budget.used_today}. {budget.connected ? "A key is present in the server environment." : "No key is set, so a reservation is refused and the budget is not spent."}
      </p>
    </section>
  );
}

function PostFields({ index, post }: { index: number; post?: DeskPost }) {
  return (
    <div className="stack">
      <label className="field">
        Slug
        <input name={`post_slug_${index}`} defaultValue={post?.slug || ""} maxLength={80} />
      </label>
      <label className="field">
        Title
        <input name={`post_title_${index}`} defaultValue={post?.title || ""} maxLength={160} />
      </label>
      <label className="field">
        Date
        <input name={`post_date_${index}`} defaultValue={post?.date || ""} placeholder="YYYY-MM-DD" />
      </label>
      <label className="field">
        Summary
        <input name={`post_summary_${index}`} defaultValue={post?.summary || ""} />
      </label>
      <label className="field">
        Body
        <textarea name={`post_body_${index}`} defaultValue={post?.body?.join("\n\n") || ""} />
      </label>
    </div>
  );
}
