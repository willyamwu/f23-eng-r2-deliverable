"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];
import React, { useState } from 'react';
// import { useState, type BaseSyntheticEvent } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

export default function SpeciesCard(profiles: Profiles) {

  return (
    <div className="min-w-72 m-3 w-full flex-none rounded border-2 p-3">
      <h1 className="mt-3 text-3xl font-semibold">{profiles.display_name}</h1>
      <a className="text-lg font-light" href={`mailto:${profiles.email}`}>{profiles.email}</a>
      <p className="text-md" >{profiles.biography}</p>
    </div>
  );
}
