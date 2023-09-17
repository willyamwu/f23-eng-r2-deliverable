"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { Database } from "@/lib/schema";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function SpeciesCard(profiles: Profiles) {

  return (
    <div className="min-w-72 m-3 w-full flex-none rounded border-2 p-3">
      <h1 className="text-3xl font-semibold">{profiles.display_name}</h1>
      <a className="text-lg font-light" href={`mailto:${profiles.email}`}>
        <span style={{ color: '#0000EE' }}>{profiles.email}
        </span>
      </a>
      <p className="mt-2 text-md" >{profiles.biography}</p>
    </div>
  );
}
