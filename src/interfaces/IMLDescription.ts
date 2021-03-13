export interface IMLDescription {
    text: string
    plain_text: string
    last_updated: string
    date_created: string
    snapshot: {
        url: string
        width: number
        height: number
        status: string
    }
}