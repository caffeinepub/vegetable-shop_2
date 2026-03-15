import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Vegetable {
    id: bigint;
    name: string;
    description: string;
    category: string;
    image?: ExternalBlob;
    price: number;
    stockAvailable: boolean;
}
export interface UserProfile {
    name: string;
    email: string;
    address: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createVegetable(name: string, price: number, description: string, category: string, stockAvailable: boolean, image: ExternalBlob | null): Promise<bigint>;
    deleteVegetable(id: bigint): Promise<void>;
    /**
     * / Public Interface - Vegetable Catalog
     */
    getAllVegetables(): Promise<Array<Vegetable>>;
    /**
     * / Public Interface - User Profile Management
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVegetable(id: bigint): Promise<Vegetable>;
    getVegetablesByCategory(category: string): Promise<Array<Vegetable>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateVegetable(id: bigint, name: string, price: number, description: string, category: string, stockAvailable: boolean, image: ExternalBlob | null): Promise<void>;
}
