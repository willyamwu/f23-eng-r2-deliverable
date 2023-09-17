"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];
import React, { useEffect } from 'react';
import { useState } from "react";
import { type z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { speciesSchema } from "./add-species-dialog"; // Assuming it's in the same directory, adjust path accordingly
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SpeciesCard(species: Species) {
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(speciesSchema),
  });

  useEffect(() => {
    if (editOpen && species) {
      setValue('common_name', species.common_name ?? '');  // Fallback to empty string if undefined
      setValue('scientific_name', species.scientific_name ?? '');
      setValue('description', species.description ?? '');
      setValue('kingdom', species.kingdom ?? '');
      setValue('total_population', species.total_population);
      setValue('image', species.image ?? '');
    }
  }, [editOpen, species, setValue]);

  type SpeciesFormData = z.infer<typeof speciesSchema>;

  const onSubmit = async (data: SpeciesFormData) => {
    // Debugging step
    console.log('Captured total_population:', species.total_population);
    // Initialize your Supabase client
    const supabase = createClientComponentClient<Database>()
    console.log('Setting total_population to:', species.total_population); // Debugging line
    const { error } = await supabase
      .from("species")
      .update({
        common_name: data.common_name,
        scientific_name: data.scientific_name,
        description: data.description,
        kingdom: data.kingdom,
        total_population: data.total_population,
        image: data.image,
        endangered: data.total_population && data.total_population > 2500 ? false : true,
      })
      .eq('id', species.id);

    if (error) {
      console.error('Error updating species:', error);
    } else {
      console.log("Successfully updated species!");
      window.location.reload();
      setEditOpen(false);
    }
  };


  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      {species.endangered && (
        <Button className="mt-3 h-5 w-50%" variant="destructive" >Endangered</Button>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>

      <div style={{ display: "flex", gap: "10px" }}>
        <Button className="mt-3 w-full" variant="default" onClick={() => setOpen(true)}>
          Learn More
        </Button>
        <Button className="mt-3 w-10" variant="secondary" onClick={() => setEditOpen(true)}>
          <Icons.pencil style={{ fontSize: '30x' }} />
        </Button>
      </div>


      {/* Detailed View */}
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


      {/* Edit Form */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label>Common Name: </label>
              <Controller
                name="common_name"
                control={control}
                render={({ field }) => <input placeholder="Common Name" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', width: '100%' }} {...field} />}
              />
            </div>
            <div className="mb-4">
              <label>Scientific Name: </label>
              <Controller
                name="scientific_name"
                control={control}
                render={({ field }) => <input placeholder="Scientific Name" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', width: '100%' }} {...field} />}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description">Description: </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    id="description"
                    placeholder="Description"
                    rows={10}
                    cols={50}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px',
                      width: '100%',  // Sets the width to 100% of the parent container
                    }}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="mb-4">
              <label>Kingdom: </label>
              <Controller
                name="kingdom"
                control={control}
                render={({ field }) => (
                  <select style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', width: '100%' }} {...field}>
                    <option value="Animalia">Animalia</option>
                    <option value="Plantae">Plantae</option>
                    <option value="Fungi">Fungi</option>
                    <option value="Protista">Protista</option>
                    <option value="Archaea">Archaea</option>
                    <option value="Bacteria">Bacteria</option>
                  </select>
                )}
              />
            </div>
            <div className="mb-4">
              <label>Total Population: </label>
              <Controller
                name="total_population"
                control={control}
                render={({ field }) => <input type="number" placeholder="Total Population" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', width: '100%' }} {...field} onChange={(event) => field.onChange(+event.target.value)} />}
              />
            </div>
            <div className="mb-4">
              <label>Image URL: </label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => <input placeholder="Image URL" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', width: '100%' }} {...field} />}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              Save Changes
            </button>
          </form>
        </DialogContent>
      </Dialog>


    </div>
  );
}
