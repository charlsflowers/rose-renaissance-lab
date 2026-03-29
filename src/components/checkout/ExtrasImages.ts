// Maps addon/extra names to their thumbnail images
import glitterRoseImg from "@/assets/glitter-rose.png";
import crownSilverImg from "@/assets/crown-silver.webp";
import crownGoldImg from "@/assets/crown-gold.webp";
import butterflyImg from "@/assets/butterfly-gold.webp";
import lettersImg from "@/assets/letters-babybreathe.png";
import noteImg from "@/assets/accessory-note.webp";

export function getExtraImage(addonName: string): string | null {
  const lower = addonName.toLowerCase();
  if (lower.includes("glitter")) return glitterRoseImg;
  if (lower.includes("crown") && lower.includes("gold")) return crownGoldImg;
  if (lower.includes("crown")) return crownSilverImg;
  if (lower.includes("butterfl")) return butterflyImg;
  if (lower.includes("letter") || lower.includes("number")) return lettersImg;
  if (lower.includes("note")) return noteImg;
  // Vase, ribbon — no dedicated image asset
  return null;
}

export function getAccessoryImage(accessory: string): string | null {
  if (accessory === "butterfly") return butterflyImg;
  return null;
}
