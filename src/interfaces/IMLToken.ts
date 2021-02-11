export default interface IMLToken {
    access_token: string,
    token_type: string,
    expires_in: number,
    scope: string,
    user_id: number,
    refresh_token: string
}