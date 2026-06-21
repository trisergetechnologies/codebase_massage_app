"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const SKILL_TAGS = ["head_upper_body", "back_core", "lower_body", "full_relaxation"];

const EMPTY = {
  slug: "",
  name: "",
  categories: [],
  skillTag: "head_upper_body",
  description: "",
  imageUrl: "",
  durationMin: 45,
  price: 899,
  addOnEligible: true,
};

export default function ServicesPage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [draft, setDraft] = useState(EMPTY);
  const [groupBy, setGroupBy] = useState("category");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.name])),
    [categories]
  );

  async function load() {
    try {
      const [cats, svcs] = await Promise.all([api.listCategories(), api.listServices()]);
      setCategories(cats);
      setServices(svcs);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    if (groupBy !== "category") return { All: services };
    const map = {};
    for (const cat of categories) map[cat.slug] = [];
    map._uncategorized = [];
    for (const s of services) {
      const slugs = s.categories?.length ? s.categories : ["_uncategorized"];
      for (const slug of slugs) {
        if (!map[slug]) map[slug] = [];
        map[slug].push(s);
      }
    }
    if (!map._uncategorized.length) delete map._uncategorized;
    return map;
  }, [services, categories, groupBy]);

  function toggleCategory(slug) {
    setDraft((d) => ({
      ...d,
      categories: d.categories.includes(slug)
        ? d.categories.filter((c) => c !== slug)
        : [...d.categories, slug],
    }));
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.createService({
        ...draft,
        durationMin: Number(draft.durationMin),
        price: Number(draft.price),
      });
      setDraft(EMPTY);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm("Deactivate this service?")) return;
    await api.deleteService(id);
    await load();
  }

  return (
    <div>
      <h1>Services</h1>

      <div className="card">
        <h2>Add a service</h2>
        <form onSubmit={save} className="form-grid">
          <label>Slug
            <input value={draft.slug} required onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </label>
          <label>Name
            <input value={draft.name} required onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label>Skill tag
            <select value={draft.skillTag} onChange={(e) => setDraft({ ...draft, skillTag: e.target.value })}>
              {SKILL_TAGS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>Duration (min)
            <input type="number" min={15} step={5} value={draft.durationMin}
              onChange={(e) => setDraft({ ...draft, durationMin: e.target.value })} />
          </label>
          <label>Price (₹)
            <input type="number" min={0} value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
          </label>
          <label>Image URL
            <input value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} />
          </label>
          <div className="full">
            <span style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Categories (multi-select)</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((c) => (
                <label key={c.slug} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={draft.categories.includes(c.slug)}
                    onChange={() => toggleCategory(c.slug)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <label className="full">Description
            <textarea rows={2} value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </label>
          <label className="full" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={draft.addOnEligible}
              onChange={(e) => setDraft({ ...draft, addOnEligible: e.target.checked })} />
            <span>Eligible to be added as an add-on during a booking</span>
          </label>
          <div className="full" style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={busy}>{busy ? "Saving..." : "Add service"}</button>
            <button type="button" className="secondary" onClick={() => setDraft(EMPTY)}>Reset</button>
          </div>
          {error && <div className="full" style={{ color: "var(--danger)" }}>{error}</div>}
        </form>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2>Catalog</h2>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
            View
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="category">By category</option>
              <option value="flat">Flat list</option>
            </select>
          </label>
        </div>

        {groupBy === "flat" ? (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Categories</th><th>Skill</th><th>Duration</th><th>Price</th><th>Add-on?</th><th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id || s.slug}>
                  <td>{s.name}</td>
                  <td>
                    {(s.categories || []).map((slug) => (
                      <span key={slug} className="badge" style={{ marginRight: 4 }}>{categoryMap[slug] || slug}</span>
                    ))}
                  </td>
                  <td><span className="badge">{s.skillTag}</span></td>
                  <td>{s.durationMin} min</td>
                  <td>₹{s.price}</td>
                  <td>{s.addOnEligible ? "Yes" : "No"}</td>
                  <td><button className="danger" onClick={() => remove(s.id || s.slug)}>Disable</button></td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={7} style={{ color: "var(--muted)" }}>No services yet — add one above or run <code>npm run seed</code>.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          Object.entries(grouped).map(([slug, items]) => (
            <section key={slug} style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 8 }}>
                {slug === "_uncategorized" ? "Uncategorized" : categoryMap[slug] || slug}
                <span style={{ color: "var(--muted)", fontWeight: 400, marginLeft: 8 }}>({items.length})</span>
              </h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>All categories</th><th>Duration</th><th>Price</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={`${slug}-${s.id || s.slug}`}>
                      <td>{s.name}</td>
                      <td>
                        {(s.categories || []).map((c) => (
                          <span key={c} className="badge" style={{ marginRight: 4 }}>{categoryMap[c] || c}</span>
                        ))}
                      </td>
                      <td>{s.durationMin} min</td>
                      <td>₹{s.price}</td>
                      <td><button className="danger" onClick={() => remove(s.id || s.slug)}>Disable</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
