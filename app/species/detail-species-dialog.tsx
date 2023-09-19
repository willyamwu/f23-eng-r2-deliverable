"use client";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];
import React from 'react';
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Created the shape for the properties
interface DetailSpeciesProps {
  species: Species;
}

export default function DetailSpeciesDialog(props: DetailSpeciesProps) {
  // Reduces the need for long code like porps.species.image
  const species = props.species;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full" variant="default" onClick={() => setOpen(true)}>
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          {species.image && (
            <div className="relative h-72 w-full">
              <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          )}
          {species.endangered && (
            <Button className="mt-3 h-5" variant="destructive" >Endangered</Button>
          )}
          <DialogTitle className="mt-3 text-3xl font-semibold">
            {species.common_name}
          </DialogTitle>
          <DialogTitle className="text-lg font-light italic">
            {species.scientific_name}
          </DialogTitle>
          <DialogDescription className="text-md">
            Kingdom: <span className="text-md font-light italic">{species.kingdom}</span>
          </DialogDescription>
          <DialogDescription className="text-md">
            Population: {species.total_population}
          </DialogDescription>
        </DialogHeader>
        <DialogDescription className="text-md font-normal">
          {species.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>

  );
}
