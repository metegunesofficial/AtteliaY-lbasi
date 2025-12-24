import { HediyeKarti } from "@/components/hediye-karti";
import type { Hediye } from "@/types/hediye";

interface HediyeGridProps {
  hediyeler: Hediye[];
  kartAc: (hedef: Hediye) => void;
}

// Dışarıdan gelen hediye listesini gösteren grid
export function HediyeGrid({ hediyeler, kartAc }: HediyeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {hediyeler.map((hediye) => (
        <HediyeKarti key={hediye.id} hediye={hediye} onAc={kartAc} />
      ))}
    </div>
  );
}
