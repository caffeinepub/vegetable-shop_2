import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Vegetable } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useGetAllVegetables() {
  const { actor, isFetching } = useActor();
  return useQuery<Vegetable[]>({
    queryKey: ["vegetables"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVegetables();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVegetablesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Vegetable[]>({
    queryKey: ["vegetables", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "all") return actor.getAllVegetables();
      return actor.getVegetablesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateVegetable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      price,
      description,
      category,
      stockAvailable,
      imageBytes,
    }: {
      name: string;
      price: number;
      description: string;
      category: string;
      stockAvailable: boolean;
      imageBytes: Uint8Array<ArrayBuffer> | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const image = imageBytes ? ExternalBlob.fromBytes(imageBytes) : null;
      return actor.createVegetable(
        name,
        price,
        description,
        category,
        stockAvailable,
        image,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vegetables"] });
    },
  });
}

export function useUpdateVegetable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      price,
      description,
      category,
      stockAvailable,
      imageBytes,
    }: {
      id: bigint;
      name: string;
      price: number;
      description: string;
      category: string;
      stockAvailable: boolean;
      imageBytes: Uint8Array<ArrayBuffer> | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const image = imageBytes ? ExternalBlob.fromBytes(imageBytes) : null;
      return actor.updateVegetable(
        id,
        name,
        price,
        description,
        category,
        stockAvailable,
        image,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vegetables"] });
    },
  });
}

export function useDeleteVegetable() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteVegetable(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["vegetables"] });
    },
  });
}
