export type SlideMediaType = 'image' | 'video';

export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  bullets?: string[];
  highlight?: string;
  mediaType: SlideMediaType;
  mediaSrc: string;
  accentObjectSrc?: string; // small floating 3D object
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "Strategic Entry into Saudi Air Defense",
    highlight: "High-level access, strategic alignment, and execution inside the Kingdom of Saudi Arabia.",
    mediaType: "video",
    mediaSrc: "/media/cover-ksa-defense.mp4",
    accentObjectSrc: "/media/obj-saudi-emblem.png"
  },
  {
    id: 2,
    title: "KSA: The Critical Air Defense Frontier",
    bullets: [
      "Vision 2030 is reshaping defense, localization, and industrial partnerships.",
      "Air defense is a top national priority with multi-billion dollar programs.",
      "The Kingdom prefers partners who align with its long-term strategic agenda, not just vendors."
    ],
    highlight: "Leidos needs more than an introduction. It needs a strategic operator inside the Kingdom.",
    mediaType: "image",
    mediaSrc: "/media/ksa-future-city.png",
    accentObjectSrc: "/media/obj-radar-core.png"
  },
  {
    id: 3,
    title: "Titan Global.sa: Strategic Operator on the Ground",
    subtitle: "Advisor · Facilitator · Strategic Connector",
    bullets: [
      "Position Leidos as a premier partner for Kingdom-wide air defense initiatives.",
      "Secure direct access to decision-makers controlling budget and strategy.",
      "Ensure regulatory and localization alignment with Vision 2030.",
      "Drive execution from first meeting to signed agreements."
    ],
    mediaType: "video",
    mediaSrc: "/media/titan-hologram.mp4",
    accentObjectSrc: "/media/obj-saudi-emblem.png"
  },
  {
    id: 4,
    title: "Direct Access to the Big Three",
    bullets: [
      "Ministry of Defense (MoD): Operational requirements & near-term defense priorities.",
      "GAMI: Localization and regulatory mandates; domestic spending and licensing.",
      "SAMI: Joint ventures, industrial partnerships, long-term production and sustainment."
    ],
    highlight: "Separate, tailored engagements for each pillar — not generic networking.",
    mediaType: "video",
    mediaSrc: "/media/commercial-structure.mp4",
    accentObjectSrc: "/media/obj-roadmap-ring.png"
  },
  {
    id: 5,
    title: "Three-Phase Engagement Model",
    bullets: [
      "Phase 1 – High-Level Access: Secure exclusive meetings with MoD, GAMI, and SAMI leadership.",
      "Phase 2 – Strategic Alignment: Tailor Leidos' value proposition to each entity's Vision 2030 mandate.",
      "Phase 3 – Execution & Follow-Through: Manage post-meeting momentum and communication to drive agreements."
    ],
    mediaType: "video",
    mediaSrc: "/media/execution-roadmap.mp4"
  },
  {
    id: 6,
    title: "Aligned Incentives, Minimal Upfront Risk",
    bullets: [
      "Strategic Advisory & Facilitation: $250,000 USD, 6-month fixed term, executive access and on-ground support.",
      "Performance Success Fee: 3% of total contract value, triggered at binding agreements with MoD, GAMI, or SAMI.",
      "Compensation directly tied to Leidos' financial success in the Kingdom."
    ],
    highlight: "The window to establish Leidos as a core air defense partner in KSA is open. Titan Global.sa is ready to operate on the ground immediately.",
    mediaType: "video",
    mediaSrc: "/media/global-defense-network.mp4"
  }
];

