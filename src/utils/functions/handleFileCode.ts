// fileHandler.ts
import { ref } from 'vue';

export interface FileHandlerOptions {
    onSuccess?: (content: string) => void;
    onError?: (error: Error) => void;
}

export class FileHandler {
    private file: File | null = null;
    private content = ref<string>('');
    private error = ref<Error | null>(null);

    setFile(newFile: File | File[] | null) {
        if (Array.isArray(newFile)) {
            this.file = newFile[0] || null;
        } else {
            this.file = newFile;
        }

        if (!this.file) {
            this.content.value = '';
            this.error.value = null;
        }
    }

    async readFile(options?: FileHandlerOptions): Promise<string> {
        if (!this.file) {
            const error = new Error('No file selected');
            this.error.value = error;
            options?.onError?.(error);
            return '';
        }

        try {
            const content = await this.readFileContent(this.file);
            this.content.value = content.trim();
            options?.onSuccess?.(this.content.value);
            return this.content.value;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to read file');
            this.error.value = error;
            options?.onError?.(error);
            return '';
        }
    }

    private readFileContent(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    resolve(result);
                } else {
                    reject(new Error('Failed to read file content'));
                }
            };

            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }

    getContent() {
        return this.content;
    }

    getError() {
        return this.error;
    }

    clear() {
        this.file = null;
        this.content.value = '';
        this.error.value = null;
    }
}

export function createFileHandler() {
    return new FileHandler();
}