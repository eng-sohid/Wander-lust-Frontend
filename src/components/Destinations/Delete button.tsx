"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteDestination } from "../../lib/Actions";

export default function DeleteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (loading) return; // don't close while deleting
    if (next) setError(null);
    setOpen(next);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    const result = await deleteDestination(id);

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/destinations");
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-red-300 bg-red-50 px-4 text-xs font-medium text-red-500 transition-colors hover:bg-red-100"
          >
            <Trash2 className="size-3.5" />
            Cancel
          </button>
        }
      />

      <DialogContent className="gap-0 rounded-none p-0 sm:max-w-[480px]">
        <div className="p-7">
          <DialogHeader className="flex-row items-center gap-3 space-y-0 text-left">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-red-50">
              <AlertTriangle className="size-5 text-red-500" />
            </span>
            <DialogTitle className="text-base font-medium text-[#1f1f1f]">
              Delete Travel Package
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="mt-5 text-xs font-light leading-relaxed text-[#444]">
            Are you sure you want to delete{" "}
            <strong className="font-semibold text-[#1f1f1f]">
              &ldquo;{name}&rdquo;
            </strong>
            ? This action cannot be undone and will permanently remove this
            travel package from the system.
          </DialogDescription>

          {error && (
            <p role="alert" className="mt-4 text-xs text-red-500">
              {error}
            </p>
          )}

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="inline-flex h-10 items-center rounded-sm border border-[#d9d9d9] bg-white px-5 text-xs font-medium text-[#1f1f1f] transition-colors hover:bg-muted disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-red-500 px-5 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
            >
              <Trash2 className="size-3.5" />
              {loading ? "Deleting..." : "Delete Package"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
