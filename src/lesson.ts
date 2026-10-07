// One lesson = one JSON file in /lessons. This is the whole contract between
// the research side (facts, hooks, scripts) and the render side (this template).

export type BlastPattern = string; // "s" short blast, "L" prolonged blast. e.g. "ss", "L", "sssss"

export type ExampleItem = {
  readonly label: string;
  // one of: a Lucide icon name (e.g. "anchor"), or a blast pattern prefixed with "blast:" (e.g. "blast:sss")
  readonly icon: string;
};

export type Lesson = {
  readonly id: string;
  readonly number: string; // "07"
  readonly title: string; // "KNOW THE HORN"
  readonly subhead: string; // "FIVE SIGNALS. ONE SECOND EACH."
  readonly cornerScript: string; // "Know the Horn"
  readonly scriptLine: string; // "Short is a second. Long is four to six."
  readonly cornerTag: string; // "SAME WATERS. BRIGHTER BOATERS."
  readonly hero: {
    readonly image?: string; // public/heroes/xx.png (painted hero, optional)
    readonly cutout?: string; // public/heroes/xx-fg.png (rembg cutout of the subject, optional, enables 2.5D)
    readonly kind: "image" | "blast-chart" | "line"; // fallback heroes when no painting exists
    readonly text?: string; // for kind "line": the big handwritten hook
  };
  readonly meaning: { readonly label: string; readonly text: string };
  readonly examples: { readonly label: string; readonly items: readonly ExampleItem[] };
  readonly tip: { readonly label: string; readonly text: string };
  readonly cta: string; // spoken + shown in the final 3 seconds
  readonly footnote: string; // "US INLAND RULES · 33 CFR 83.34"
  readonly durationSeconds: number;
  // beat timing in seconds (start of each beat); the last beat runs to the end
  readonly beats: {
    readonly meaning: number;
    readonly examples: number;
    readonly tip: number;
    readonly cta: number;
  };
};
