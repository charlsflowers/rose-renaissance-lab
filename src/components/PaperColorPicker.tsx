import { Check } from "lucide-react";
import paperAzul from "@/assets/paper-azul.png";
import paperBlanco from "@/assets/paper-blanco.png";
import paperMarron from "@/assets/paper-marron.png";
import paperMorado from "@/assets/paper-morado.png";
import paperNegro from "@/assets/paper-negro.png";
import paperRosaLight from "@/assets/paper-rosa-light.png";

export interface PaperColorOption {
  name: string;
  image: string;
}

export const paperColorOptions: PaperColorOption[] = [
  { name: "Blanco", image: paperBlanco },
  { name: "Rosa Light", image: paperRosaLight },
  { name: "Marrón", image: paperMarron },
  { name: "Morado", image: paperMorado },
  { name: "Azul", image: paperAzul },
  { name: "Negro", image: paperNegro },
];

interface PaperColorPickerProps {
  selected: string;
  onChange: (name: string) => void;
}

const PaperColorPicker = ({ selected, onChange }: PaperColorPickerProps) => {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {paperColorOptions.map((paper) => (
          <button
            key={paper.name}
            onClick={() => onChange(paper.name)}
            className={`relative flex flex-col items-center gap-2 p-2 rounded-sm border-2 transition-all ${
              selected === paper.name
                ? "border-primary bg-primary/5 scale-105 shadow-md"
                : "border-border hover:border-primary/30 hover:scale-105"
            }`}
          >
            <div className="w-16 h-16 rounded-sm overflow-hidden bg-muted">
              <img
                src={paper.image}
                alt={`Papel ${paper.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-body text-foreground">{paper.name}</span>
            {selected === paper.name && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaperColorPicker;
