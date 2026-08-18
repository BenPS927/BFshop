import { receivedOrdersMapping } from "./receivedOrdersMapping";

export function ReceivedBoard() {
    const receivedBoard = receivedOrdersMapping()

    return receivedBoard
}