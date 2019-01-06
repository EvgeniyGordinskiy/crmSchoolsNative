import {Block} from './block';

export class Lesson {
  'id'?: number;
  'name': number;
  'description': string;
  'order_list': number;
  blocks: Block[];
  curriculum_id?: number;
  count?: number;
  nextTime?: string;
}
