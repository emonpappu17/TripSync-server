"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMilliseconds = void 0;
// Convert "1d" | "2h" | "30m" | "1M" | "1y" etc. → milliseconds
const convertToMilliseconds = (value) => {
    const unit = value.slice(-1); // last character (d, h, m, s, M, y, w)
    const number = parseInt(value.slice(0, -1)); // the numeric part
    switch (unit) {
        case "y": // years
            return number * 365 * 24 * 60 * 60 * 1000;
        case "M": // months (approx 30 days)
            return number * 30 * 24 * 60 * 60 * 1000;
        case "w": // weeks
            return number * 7 * 24 * 60 * 60 * 1000;
        case "d": // days
            return number * 24 * 60 * 60 * 1000;
        case "h": // hours
            return number * 60 * 60 * 1000;
        case "m": // minutes
            return number * 60 * 1000;
        case "s": // seconds
            return number * 1000;
        default:
            return 60 * 60 * 1000; // default 1 hour
    }
};
exports.convertToMilliseconds = convertToMilliseconds;
