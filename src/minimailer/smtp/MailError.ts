export class MailError extends Error {
    public responseCode!: number;

    public constructor(error?: string, code?: number) {
        super(error);
        if (typeof code === "number") this.responseCode = code;
    }
}
