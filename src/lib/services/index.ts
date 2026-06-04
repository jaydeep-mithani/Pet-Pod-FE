import { api } from "@/lib/api/client";
import type {
  PetDetail,
  PetListItem,
  PetSpecies,
  PetStatus,
  Photo,
} from "@/types";

export interface PetListQuery {
  species?: PetSpecies;
  status?: PetStatus;
  city?: string;
  ownerId?: string;
  limit?: number;
}

export interface PhotoInput {
  url: string;
  publicId?: string;
}

export interface CreatePetInput {
  name?: string;
  species: PetSpecies;
  breed?: string;
  ageMonths: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  shortDescription: string;
  story?: string;
  reasonForRehoming?: string;
  city: string;
  region?: string;
  country: string;
  photos?: PhotoInput[];
}

export interface UpdatePetInput extends Partial<CreatePetInput> {
  status?: PetStatus;
}

function buildQuery(query: PetListQuery = {}): string {
  const params = new URLSearchParams();
  if (query.species) params.set("species", query.species);
  if (query.status) params.set("status", query.status);
  if (query.city) params.set("city", query.city);
  if (query.ownerId) params.set("ownerId", query.ownerId);
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const petsService = {
  list: (query: PetListQuery = {}) =>
    api.get<PetListItem[]>(`/pets${buildQuery(query)}`),

  listFeatured: (limit = 6) => api.get<PetListItem[]>(`/pets?limit=${limit}`),

  listMine: () => api.get<PetListItem[]>("/pets/mine"),

  getById: (id: string) => api.get<PetDetail>(`/pets/${id}`),

  create: (input: CreatePetInput) => api.post<PetDetail>("/pets", input),

  update: (id: string, input: UpdatePetInput) =>
    api.patch<PetDetail>(`/pets/${id}`, input),

  remove: (id: string) => api.delete<void>(`/pets/${id}`),

  addPhoto: (id: string, body: PhotoInput) =>
    api.post<Photo>(`/pets/${id}/photos`, body),

  removePhoto: (id: string, photoId: string) =>
    api.delete<void>(`/pets/${id}/photos/${photoId}`),

  reorderPhotos: (id: string, photoIds: string[]) =>
    api.patch<Photo[]>(`/pets/${id}/photos/order`, { photoIds }),
};
