import {UserType} from './user.type.js';

export type CommentType = {
  text: string;
  publicationDate: Date;
  rating: number;
  author: UserType;
}
