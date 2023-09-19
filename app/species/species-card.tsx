"use client";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];
import React from 'react';
import EditSpeciesDialog from "./edit-species-dialog";
import DeleteSpeciesDialog from "./delete-species-dialog";
import DetailSpeciesDialog from "./detail-species-dialog";


export default function SpeciesCard(species: Species) {
  return (
    // Card Template
    <div className="min-w-72 m-4 h-full w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full" style={{ display: "flex", gap: "10px" }}>
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      {species.endangered && (
        <Button className="mt-3 mb-0 h-5 w-50%" variant="destructive" >Endangered</Button>
      )}
      <div>
        <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
        <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
        <p>{species.description && species.description.length > 150 ? species.description.slice(0, 150).trim() + "..." : species.description}</p>

        <div style={{ display: "flex", gap: "10px" }}>
          <DetailSpeciesDialog species={species} />
          <EditSpeciesDialog species={species} />
          <DeleteSpeciesDialog species={species} />
        </div>
      </div>
    </div>
  );
}
