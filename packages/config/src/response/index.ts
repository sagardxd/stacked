export class Response {
    static success<T>(data: T) {
        return {
            success: true,
            data: data
        };
    }

    static error(message: string) {
        return {
            success: false,
            message: message
        };
    }
}
