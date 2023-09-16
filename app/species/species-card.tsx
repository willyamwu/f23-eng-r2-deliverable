"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];
import React from 'react';
import { useState, type BaseSyntheticEvent } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { spec } from "node:test/reporters";


export default function SpeciesCard(species: Species) {
  const [open, setOpen] = useState<boolean>(false);
  //const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <Button className="mt-3 w-full" variant="secondary" onClick={() => setOpen(true)}>
          Learn More
        </Button>
        <Button className="mt-3 w-10" variant="secondary" onClick={() => setOpen(true)}>
          <Icons.pencil style={{ fontSize: '30x' }} />
        </Button>
      </div>
      {/* Replace with detailed view */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>

        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            {species.image && (
              <div className="relative h-72 w-full">
                <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            )}
            <DialogTitle className="mt-3 text-3xl font-semibold">{species.common_name} </DialogTitle>
            <DialogTitle className="text-lg font-light italic">{species.scientific_name} </DialogTitle>
            <DialogDescription className="text-md font-light">
              Kingdom: <span className="text-md font-light italic">{species.kingdom}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogDescription className="text-md">
            Population: {species.total_population}
          </DialogDescription>
          <DialogDescription className="text-md font-normal">
            {species.description}
          </DialogDescription>
        </DialogContent>
      </Dialog>





    </div>
  );
}
