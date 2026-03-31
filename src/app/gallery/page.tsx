"use client";

import PolarCanvas from "@/components/PolarCanvas";
import { curves } from "@/lib/curves";

export default function Gallery() {
  return (
    <main className="min-h-screen bg-[#0a0a14] p-4">
      <h1 className="text-white text-2xl font-bold mb-4 text-center">
        All {curves.length} Curves
      </h1>
      <div className="grid grid-cols-5 gap-3 max-w-[1400px] mx-auto">
        {curves.map((curve, i) => (
          <div key={curve.id} className="flex flex-col items-center">
            <div className="bg-[#12122a] rounded-lg p-1 border border-[#252540]">
              <PolarCanvas
                rFunc={curve.rFunc}
                thetaRange={curve.thetaRange}
                size={200}
              />
            </div>
            <span className="text-[10px] text-gray-400 mt-1 text-center leading-tight">
              #{i + 1} {curve.expression}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
