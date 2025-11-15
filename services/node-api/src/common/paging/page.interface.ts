import { OrderTypeKeys } from "./page.enum";

export interface IPageOptions {
    page?: number;
    take?: number;
    order?: OrderTypeKeys;
    orderBy?: string;
    skip: number;
} 
