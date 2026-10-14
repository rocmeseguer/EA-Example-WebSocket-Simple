/**
 * MODELO: Message (mismo contrato que server/src/models/message.ts)
 * `readonly` impide mutar el objeto tras crearlo (inmutabilidad).
 */
export interface IMessage {
    readonly from: string;
    readonly content: string;
}
