import { Plugin, SupportLanguage, Parser, Printer, SupportOptions, RequiredOptions } from 'prettier';
import { Token } from 'pug-lexer';

declare enum LogLevel {
    DEBUG = "debug",
    LOG = "log",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    OFF = "off"
}
type ILogger = Pick<typeof console, 'debug' | 'log' | 'info' | 'warn' | 'error'>;
declare class Logger implements ILogger {
    private readonly logger;
    private level;
    constructor(logger?: ILogger, level?: LogLevel);
    static isSupportedLogLevel(value: unknown): value is LogLevel;
    setLogLevel(level: LogLevel): void;
    isDebugEnabled(): boolean;
    debug(message?: unknown, ...optionalParams: any[]): void;
    log(message?: unknown, ...optionalParams: any[]): void;
    info(message?: unknown, ...optionalParams: any[]): void;
    warn(message?: unknown, ...optionalParams: any[]): void;
    error(message?: unknown, ...optionalParams: any[]): void;
    private message;
}
declare function createLogger(logger?: ILogger): Logger;
declare const logger: Logger;

interface AstPathStackEntry {
    content: string;
    tokens: Token[];
}
declare const plugin: Plugin<AstPathStackEntry>;
declare const languages: SupportLanguage[] | undefined;
declare const parsers: {
    [parserName: string]: Parser;
} | undefined;
declare const printers: {
    [astFormat: string]: Printer;
} | undefined;
declare const options: SupportOptions | undefined;
declare const defaultOptions: Partial<RequiredOptions> | undefined;

export { type ILogger, LogLevel, Logger, createLogger, defaultOptions, languages, logger, options, parsers, plugin, printers };
