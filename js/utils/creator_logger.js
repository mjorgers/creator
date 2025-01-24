'use strict';
/**
 * @enum {number}
 */
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

/**
 * @enum {string}
 */
const COLORS = {
    ERROR: '\x1b[31m', // red
    WARN: '\x1b[33m',  // yellow
    INFO: '\x1b[36m',  // cyan
    DEBUG: '\x1b[90m', // gray
    RESET: '\x1b[0m'   // reset
};


class Logger {
    static LOG_LEVELS = LOG_LEVELS;
    static COLORS = COLORS;

    /**
     * @param {boolean} [enabled=true] - Whether logging is enabled
     * @param {number} [level=LOG_LEVELS.DEBUG] - Initial log level
     */
    constructor(enabled = true, level = LOG_LEVELS.DEBUG) {
        this.enabled = enabled;
        this.level = level;
    }

    /**
     * @param {keyof typeof LOG_LEVELS} level
     * @throws {Error} If invalid level provided
     */
    setLevel(level) {
        if (!(level in LOG_LEVELS)) {
            throw new Error(`Invalid log level: ${level}`);
        }
        this.level = LOG_LEVELS[level];
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    /**
     * @private
     * @returns {string}
     */
    _extractCaller() {
        try {
            const stack = new Error().stack.split('\n');
            for (let i = 1; i < stack.length; i++) {
                const line = stack[i];
                // We need to skip internal logger calls
                if (line.includes('creator_logger.js')) {
                    continue;
                }
                const match = line.match(/\((.+):(\d+):(\d+)\)/) || 
                             line.match(/at (.+):(\d+):(\d+)/);
                if (match) {
                    return `[${match[2]}:${match[3]}]`;
                }
            }
            return '';
        } catch {
            return '';
        }
    }

    /**
     * @private
     * @param {string} message
     * @param {keyof typeof LOG_LEVELS} level
     */
    #log(message, level) {
        if (!this.enabled || LOG_LEVELS[level] > this.level) return;

        const caller = this._extractCaller();
        const prefix = `${COLORS[level]}[${level}]${caller ? ' ' + caller : ''}`;
        
        console.log(`${prefix} ${message}${COLORS.RESET}`);
    }

    error(message) { this.#log(String(message), 'ERROR'); }
    warn(message)  { this.#log(String(message), 'WARN'); }
    info(message)  { this.#log(String(message), 'INFO'); }
    debug(message) { this.#log(String(message), 'DEBUG'); }
}

// Create singleton instance
const logger = new Logger();

/**
 * @param {string} msg
 * @param {keyof typeof LOG_LEVELS} [level='INFO']
 */
const console_log = (msg, level = 'INFO') => {
    // This is a simple wrapper around the logger class
    // needed to maintain compatibility with the original
    // console_log function.
    switch(level) {
        case 'ERROR': return logger.error(msg);
        case 'WARN':  return logger.warn(msg);
        case 'DEBUG': return logger.debug(msg);
        default:      return logger.info(msg);
    }
};

module.exports = {
    Logger,
    logger,
    console_log,
    LOG_LEVELS,
    COLORS
};