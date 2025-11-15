declare global {
    export type Uuid = string & { _uuidBrand: undefined };
    interface Date {
        subtractDays(numberOfDays: number): Date;
        addDays(numberOfDays: number): Date;
    }
}

export { };
