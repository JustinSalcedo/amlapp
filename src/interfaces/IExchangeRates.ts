export interface IExchangeRates {
    disclaimer: string
    license: string
    timestamp: number
    base: string
    rates: { [key: string]: number }
}