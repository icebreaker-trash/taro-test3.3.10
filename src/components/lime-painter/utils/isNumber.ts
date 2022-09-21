export default function isNumber(value: any) {
    return /^-?\d+(\.\d+)?$/.test(value);
}