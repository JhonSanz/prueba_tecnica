export default function numberFormatter(number: number): number {
    return Math.round(number * 100) / 100;
}