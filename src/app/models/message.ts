import {User} from './user';

export class Message{
  'id'?: number;
  'body': string;
  'subject'?: string;
  'sender': User;
  'recipient': User;
  'recipients': number[];
  'to': number[];
  read_at: string;
  status: string;
  creating?: boolean;
}
