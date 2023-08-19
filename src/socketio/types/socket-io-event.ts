export interface SocketIoEvent {
    name: string
    message: unknown
    namespace?: string | void
    rooms?: string[] | void
}