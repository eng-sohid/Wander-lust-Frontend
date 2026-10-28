"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, PackagePlus, LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

type FormState = {
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const CATEGORIES = [
  "Beach",
  "Mountain",
  "Adventure",
  "Cultural",
  "Luxury",
  "Family",
  "Honeymoon",
  "Safari",
  "City Break",
  "Wellness",
] as const;

const initialForm: FormState = {
  name: "",
  country: "",
  category: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

const fieldClasses =
  "h-11 rounded-md border border-transparent bg-[#f3f3f3] text-[15px] text-foreground shadow-none placeholder:text-[#8d8d8d] focus-visible:border-transparent focus-visible:ring-0";

export default function AddDestinationPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = (data: FormState) => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!data.name.trim()) nextErrors.name = "Destination name is required.";
    if (!data.country.trim()) nextErrors.country = "Country is required.";
    if (!data.category) nextErrors.category = "Please select a category.";
    if (!data.price.trim()) {
      nextErrors.price = "Price is required.";
    } else if (Number.isNaN(Number(data.price)) || Number(data.price) <= 0) {
      nextErrors.price = "Price must be a positive number.";
    }
    if (!data.duration.trim()) nextErrors.duration = "Duration is required.";
    if (!data.departureDate)
      nextErrors.departureDate = "Departure date is required.";
    if (
      data.imageUrl.trim() &&
      !/^https?:\/\/\S+$/i.test(data.imageUrl.trim())
    ) {
      nextErrors.imageUrl = "Image URL must start with http:// or https://";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(form);

    const { data } = await authClient.token();
    const token = data?.token;

    const res = await fetch("http://localhost:8000/add-destination", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    console.log(result);

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      // Simulate a save request so the button shows its busy state.
      await new Promise((resolve) => setTimeout(resolve, 600));

      const stored = window.localStorage.getItem("wanderlust-destinations");
      const destinations: unknown[] = stored
        ? (JSON.parse(stored) as unknown[])
        : [];

      destinations.push({
        id: crypto.randomUUID(),
        ...form,
        price: Number(form.price),
        departureDate: new Date(form.departureDate).toISOString(),
        createdAt: new Date().toISOString(),
      });

      window.localStorage.setItem(
        "wanderlust-destinations",
        JSON.stringify(destinations),
      );

      router.push("/");
    } catch {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrors({});
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-[clamp(2.4rem,4vw,4rem)] font-light tracking-[-0.05em] text-[#1f1f1f] sm:mb-12">
          Add New Travel Package
        </h1>

        <Card className="mx-auto w-full max-w-[640px] rounded-[18px] border border-[#e5e5e5] bg-[#f7f7f6] p-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-5 px-6 py-5 text-sm sm:px-7">
              {/* Destination Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Destination Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  placeholder="Bali Paradise"
                  aria-invalid={!!errors.name}
                  className={`${fieldClasses} bg-background`}
                />
                {errors.name && <FieldError message={errors.name} />}
              </div>

              {/* Country + Category */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(event) =>
                      setField("country", event.target.value)
                    }
                    placeholder="Indonesia"
                    aria-invalid={!!errors.country}
                    className={`${fieldClasses} bg-background`}
                  />
                  {errors.country && <FieldError message={errors.country} />}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setField("category", value as string)
                    }
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                      className={`${fieldClasses} bg-background w-full`}
                    >
                      <SelectValue placeholder="Beach" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <FieldError message={errors.category} />}
                </div>
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(event) => setField("price", event.target.value)}
                    placeholder="e.g., 1299"
                    aria-invalid={!!errors.price}
                    className={`${fieldClasses} bg-background`}
                  />
                  {errors.price && <FieldError message={errors.price} />}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(event) =>
                      setField("duration", event.target.value)
                    }
                    placeholder="e.g., 7 Days/6 Nights"
                    aria-invalid={!!errors.duration}
                    className={`${fieldClasses} bg-background`}
                  />
                  {errors.duration && <FieldError message={errors.duration} />}
                </div>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={form.departureDate}
                  onChange={(event) =>
                    setField("departureDate", event.target.value)
                  }
                  aria-invalid={!!errors.departureDate}
                  className={`${fieldClasses} bg-background`}
                />
                {errors.departureDate && (
                  <FieldError message={errors.departureDate} />
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) => setField("imageUrl", event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  aria-invalid={!!errors.imageUrl}
                  className={`${fieldClasses} bg-background`}
                />
                {errors.imageUrl && <FieldError message={errors.imageUrl} />}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    setField("description", event.target.value)
                  }
                  placeholder="Describe the travel experience..."
                  className="min-h-28 rounded-lg bg-muted/50"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-none bg-transparent px-6 pb-5 pt-2 sm:px-7">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCancel}
                disabled={submitting}
                className="h-11 rounded-md border border-[#ef5a5a] bg-white px-4 text-sm font-medium text-[#ef5a5a] hover:bg-[#fff1f1] hover:text-[#dd3f3f]"
              >
                <Trash2 data-icon="inline-start" className="size-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-md border border-[#1aa6cf] bg-[#1aa6cf] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1499c5]"
                disabled={submitting}
              >
                {submitting ? (
                  <LoaderCircle
                    data-icon="inline-start"
                    className="size-4 animate-spin"
                  />
                ) : (
                  <PackagePlus data-icon="inline-start" className="size-4" />
                )}
                {submitting ? "Adding..." : "Add Travel Package"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="text-xs font-medium text-destructive">{message}</p>;
}
