"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil, Save, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
type EditableDestination = {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const CATEGORIES = [
  "Beach",
  "Adventure",
  "Cultural",
  "City",
  "Mountain",
  "Wildlife",
  "Luxury",
];

// <input type="date"> needs yyyy-mm-dd
function toDateInput(value: string) {
  const date = new Date(value);
  return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function toFormState(d: EditableDestination) {
  return {
    name: d.name ?? "",
    country: d.country ?? "",
    category: d.category ?? "",
    price: String(d.price ?? ""),
    duration: d.duration ?? "",
    departureDate: toDateInput(d.departureDate),
    imageUrl: d.imageUrl ?? "",
    description: d.description ?? "",
  };
}

const fieldClass =
  "h-10 w-full rounded-sm bg-[#f4f4f4] px-3 text-xs text-[#1f1f1f] outline-none placeholder:text-[#9a9a9a] focus-visible:ring-2 focus-visible:ring-[#17a2c4]";
const labelClass = "mb-1.5 block text-[11px] font-medium text-[#333]";

export default function EditDestinationDialog({
  destination,
}: {
  destination: EditableDestination;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toFormState(destination));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = CATEGORIES.includes(destination.category)
    ? CATEGORIES
    : [destination.category, ...CATEGORIES].filter(Boolean);

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // always start from the latest saved values
      setForm(toFormState(destination));
      setError(null);
    }
    setOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const price = Number(form.price);
    if (!form.name.trim() || !form.country.trim() || !form.category) {
      setError("Name, country and category are required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:8000/destination/${destination._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            country: form.country.trim(),
            category: form.category,
            price,
            duration: form.duration.trim(),
            departureDate: form.departureDate,
            imageUrl: form.imageUrl.trim(),
            description: form.description.trim(),
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update destination");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-[#d9d9d9] bg-white px-4 text-xs font-medium text-[#1f1f1f] transition-colors hover:bg-muted"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>
        }
      />

      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-none p-0 sm:max-w-[560px]">
        <form onSubmit={handleSubmit} className="p-7">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="text-base font-medium text-[#1f1f1f]">
              Update Travel Package
            </DialogTitle>
            <DialogDescription className="text-[11px] font-light text-[#555]">
              Make changes to the travel package details below
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Destination name
              </label>
              <input
                id="name"
                value={form.name}
                onChange={set("name")}
                placeholder="e.g., Bali Paradise"
                className={fieldClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>
                <input
                  id="country"
                  value={form.country}
                  onChange={set("country")}
                  placeholder="e.g., Indonesia"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={form.category}
                    onChange={set("category")}
                    className={`${fieldClass} appearance-none pr-8`}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#777]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price (USD)
                </label>
                <input
                  id="price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={set("price")}
                  placeholder="e.g., 1299"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className={labelClass}>
                  Duration
                </label>
                <input
                  id="duration"
                  value={form.duration}
                  onChange={set("duration")}
                  placeholder="e.g., 7 Days/6 Nights"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="departureDate" className={labelClass}>
                Departure Date
              </label>
              <input
                id="departureDate"
                type="date"
                value={form.departureDate}
                onChange={set("departureDate")}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className={labelClass}>
                Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={set("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={set("description")}
                placeholder="Describe the travel experience..."
                className={`${fieldClass} h-24 resize-none py-2.5`}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-xs text-red-500">
              {error}
            </p>
          )}

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-red-300 bg-white px-5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="size-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-[#17a2c4] px-5 text-xs font-medium text-white transition-colors hover:bg-[#1499c5] disabled:opacity-60"
            >
              <Save className="size-3.5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
