import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './comment.entity.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import CommentService from './comment.service.js';
import {Component} from '../../types/component.enum.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}

