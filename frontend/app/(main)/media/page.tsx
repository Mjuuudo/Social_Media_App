import PageHeader from "../../components/layout/PageHeader";
import Icon from "../../components/ui/Icon";
import Scene, { type SceneName } from "../../components/ui/Scene";
import { Button, NotificationBell, Segmented, SectionTitle } from "../../components/ui/Controls";
import { albums, tints } from "../../lib/mock";

// Mosaic of recent photos. `span` = Tailwind grid classes for that tile.
const recent: { scene: SceneName; span: string; video?: string }[] = [
  { scene: "flower", span: "row-span-2" },
  { scene: "canyon", span: "col-span-2 sm:col-span-2" },
  { scene: "desert", span: "row-span-2 hidden sm:block" },
  { scene: "lake", span: "" },
  { scene: "salad", span: "", video: "0:42" },
  { scene: "latte", span: "col-span-2" },
  { scene: "mountain", span: "col-span-2" },
];

export default function MediaPage() {
  return (
    <div>
      <PageHeader title="Media">
        <Segmented items={["Photos", "Videos", "Albums"]} active="Photos" />
        <Button icon="upload">Upload</Button>
        <NotificationBell />
      </PageHeader>

      <section className="mt-8">
        <SectionTitle>Albums</SectionTitle>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4 2xl:max-w-[860px]">
          {albums.map((a, i) => (
            <a key={a.title} href="#" className={`rounded-[28px] p-2 pb-4 transition hover:-translate-y-0.5 ${tints[i % tints.length]}`}>
              <div className="h-32 overflow-hidden rounded-[22px]">
                <Scene name={a.scene} label={a.title} />
              </div>
              <p className="mt-3 px-2 font-bold text-ink">{a.title}</p>
              <p className="px-2 text-xs text-muted">{a.count} photos</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <SectionTitle>Recent photos</SectionTitle>
          <span className="text-sm text-muted">October 2026</span>
        </div>
        <div className="mt-5 grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[150px] sm:grid-cols-4">
          {recent.map((p) => (
            <button key={p.scene} type="button" className={`relative overflow-hidden rounded-3xl ${p.span}`}>
              <Scene name={p.scene} />
              {p.video && (
                <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink">
                  <Icon name="play" className="h-3 w-3" /> {p.video}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
