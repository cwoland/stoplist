export interface ApiErrorBody {
    error: string;
    fieldErrors?: Record<string, string[]>;
}