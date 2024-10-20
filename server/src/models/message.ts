import {IUser} from './user';

export interface IMessage {
    from: IUser;
    content: string;
}
