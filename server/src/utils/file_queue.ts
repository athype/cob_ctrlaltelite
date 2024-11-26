export type FileStatus = 'queued' | 'processing' | 'completed' | 'failed';

export class QueuedFile {
    public path: string;
    public status: FileStatus;
    public result?: string;
    public hash: string;

    constructor(path: string, hash: string) {
        this.path = path;
        this.status = 'queued';
        this.hash = hash;
    }
}

export class FileQueue {
    private queue: Map<string, QueuedFile>;

    get length(): number {
        return this.queue.size || 0;
    }

    constructor() {
        this.queue = new Map();
    }

    public add(file: QueuedFile): void {
        this.queue.set(file.hash, file);
    }

    public remove(hash: string): void {
        this.queue.delete(hash);
    }

    public update(hash: string, status: FileStatus, result?: string): void {
        const file = this.queue.get(hash);
        if (file) {
            file.status = status;
            file.result = result;
        }
    }

    public get(hash: string): QueuedFile | undefined {
        return this.queue.get(hash);
    }

    public getLastQueued(): QueuedFile | undefined {
        return Array.from(this.queue.values()).find((file) => file.status === 'queued');
    }

    public getAll(): QueuedFile[] {
        return Array.from(this.queue.values());
    }
}