"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
type Species = Database["public"]["Tables"]["species"]["Row"];
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { type Database } from "@/lib/schema";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";

interface SpeciesProps {
  species: Species;
}

export default function DeleteSpeciesDialog(props: SpeciesProps) {
  const species = props.species;

  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm();

  const onDelete = async () => {

    const supabase = createClientComponentClient<Database>();
    const { error } = await supabase.from("species")
      .delete()
      .eq("id", species.id);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    setOpen(false);

    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button className="mt-3 w-15%" variant="trash" onClick={() => setOpen(true)}>
          <Icons.trash className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">

        <DialogHeader>
          <DialogTitle className="mt-3 text-3xl font-semibold">
            Delete {species.common_name}?
          </DialogTitle>
          <DialogDescription className="text-lg">
            Are you sure you want to delete {species.common_name}? <span className="text-lg font-bold">This action is not reversible!</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onDelete)(e)}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button className="mt-2 w-50%" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="mt-2 w-50%" variant="destructive">
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >

  );

}
