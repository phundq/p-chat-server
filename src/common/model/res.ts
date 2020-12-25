export declare class Rsp {
    normalErrors: MessageError[];
    badErrors: MessageError[];
}

export interface MessageError {
    id: string | number;
    message: string;
}