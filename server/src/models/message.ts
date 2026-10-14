/**
 * MODELO: Message
 * `readonly` impide mutar el objeto tras crearlo (inmutabilidad, pilar de la PF).
 */
export interface IMessage {
    readonly from: string;
    readonly content: string;
}

/**
 * Type guard: valida en tiempo de ejecución datos que llegan de la red.
 * Por qué: el tipo de TS desaparece al compilar; un cliente puede enviar cualquier cosa.
 * Al devolver `value is IMessage`, TS "estrecha" el tipo dentro del `if`.
 */
export const isMessage = (value: unknown): value is IMessage =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).from === 'string' &&
    typeof (value as Record<string, unknown>).content === 'string';
