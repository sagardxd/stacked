class Logger {

    error(funcName: string, detail: string, error?: any) {
        console.log(`ERROR => [function: ${funcName} | detail: ${detail} | error: ${error}]`)
        console.log('');

    }

    info(log: string) {
        console.log(`INFO => [${log}]`)
        console.log('');
    }
}

export const logger = new Logger();