import { ApiController, DELETE, GET, PATCH, POST } from 'core/api-decorators';
import { NextFunction, Response } from 'express';
import { requireToken } from 'middlewares/require-token';
import { dtoValidator } from 'middlewares/validate';
import BaseRequest from 'modules/base/base.request';
import { NoteCreateUpdateDto } from 'modules/dto/note-create-update.dto';
import { NoteGetOneDto } from 'modules/dto/note-get-one';
import NoteService from 'modules/services/note.service';
import NoteModels from 'swagger/note-models';
import SwaggerUtils from 'swagger/swagger-utils';

@ApiController('/notes')
class ExampleController {
  @GET('/', {
    responses: [SwaggerUtils.body200(NoteModels.resNoteList)],
    handlers: [requireToken],
  })
  async getNoteList(req: BaseRequest, res: Response, next: NextFunction) {
    const notes = await NoteService.getNoteList(req.userId);
    res.json(notes);
  }

  @GET('/:id', {
    responses: [SwaggerUtils.body200(NoteModels.resNoteInfo)],
    handlers: [requireToken],
  })
  async getNoteById(req: BaseRequest, res: Response, next: NextFunction) {
    console.log(req.params.id, req.userId);
    
    const dto: NoteGetOneDto = {
      id: req.params.id,
      userId: req.userId,
    };
    const item = await NoteService.getNoteById(dto);
    res.json(item);
  }

  @POST('/', {
    handlers: [dtoValidator(NoteCreateUpdateDto), requireToken],
    responses: [SwaggerUtils.body200(NoteModels.resNoteInfo)],
  })
  async createNote(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteCreateUpdateDto = { ...req.body, userId: req.userId };
    const item = await NoteService.createNote(dto);
    res.json(item);
  }

  @PATCH('/:id', {
    handlers: [dtoValidator(NoteCreateUpdateDto), requireToken],
    responses: [SwaggerUtils.body200(NoteModels.resNoteInfo)],
  })
  async updateNote(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteCreateUpdateDto = { ...req.body, id: req.params.id, userId: req.userId };
    const item = await NoteService.updateNote(dto);
    res.json(item);
  }

  @DELETE('/:id', {
    handlers: [requireToken],
  })
  async deleteNote(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteGetOneDto = {
      id: req.params.id,
      userId: req.userId,
    };
    const result = await NoteService.deleteNote(dto);
    res.json(result);
  }
}

export default new ExampleController();
