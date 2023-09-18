"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];
import React, { useEffect } from 'react';
import { useState } from "react";
import { type z } from "zod";
import { toast } from "@/components/ui/use-toast";


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
import { speciesSchema } from "./add-species-dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";


export default function SpeciesCard(species: Species) {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const deleteButtonPressed = async () => {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.from("species").delete().eq('id', species.id);
    // .delete()
    // .eq('id', species.id);


    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    console.log("Successfully deleted species!");

    setDeleteOpen(false);

    console.log(species.id);
    router.refresh();
  }

  // type FormData = z.infer<typeof speciesSchema>;

  // const defaultValues: Partial<FormData> = {
  //   common_name: species.common_name,
  //   scientific_name: species.scientific_name,
  //   description: species.description,
  //   kingdom: species.kingdom,
  //   total_population: species.total_population ?? null,
  //   image: species.image ?? '',
  // };

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
    // Initialize your Supabase client
    const supabase = createClientComponentClient<Database>()
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
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    setEditOpen(false);

    console.log(species.id);
    router.refresh();

  };


  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full" style={{ display: "flex", gap: "10px" }}>
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
        <Button className="mt-3 w-15%" variant="outline" onClick={() => setEditOpen(true)}>
          <Icons.pencil className="h-5 w-5" />
        </Button>
        <Button className="mt-3 w-15%" variant="trash" onClick={() => setDeleteOpen(true)}>
          <Icons.trash className="h-5 w-5" />
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
            {species.endangered && (
              <Button className="mt-3 h-5" variant="destructive" >Endangered</Button>
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
            <h1 className="mb-2 text-2xl font-semibold">Edit {species.common_name}</h1>
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
                    rows={5}
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

      {/* Delete pop up */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="mt-3 text-3xl font-semibold">Delete {species.common_name}?</DialogTitle>
            <DialogDescription className="text-lg">
              Are you sure you want to delete {species.common_name}? <span className="text-lg font-bold">This action is not reversible!</span>
            </DialogDescription>
          </DialogHeader>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button className="mt-2 w-50%" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button className="mt-2 w-50%" variant="destructive" onClick={() => deleteButtonPressed()}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
