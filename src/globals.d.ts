declare global {

    interface MouseEvent {
        sourceCapabilities?: { firesTouchEvents: boolean }
    }
}