import { ApiController, DELETE, GET, PATCH, POST } from 'core/api-decorators';
import { NextFunction, Response } from 'express';
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
  })
  async getNoteList(req: BaseRequest, res: Response, next: NextFunction) {
    const notes = await NoteService.getNoteList(req.body.id);
    res.json(notes);
  }

  @GET('/:id', {
    responses: [SwaggerUtils.body200(NoteModels.resNoteInfo)],
  })
  async getNoteById(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteGetOneDto = {
      id: req.params.id,
      userId: req.body.id,
    };
    const item = await NoteService.getNoteById(dto);
    res.json(item);
  }

  @POST('/', {
    handlers: [dtoValidator(NoteCreateUpdateDto)],
    responses: [SwaggerUtils.body200(NoteModels.resNoteInfo)],
  })
  async createNote(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteCreateUpdateDto = req.body;
    const item = await NoteService.createItem(dto);
    res.json(item);
  }

  @PATCH('/:id', {
    handlers: [dtoValidator(NoteCreateUpdateDto)],
    responses: [SwaggerUtils.body200(NoteModels.resNoteInfo)],
  })
  async updateNote(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteCreateUpdateDto = { ...req.body, id: req.params.id };
    const item = await NoteService.updateItem(dto);
    res.json(item);
  }

  @DELETE('/:id')
  async deleteNote(req: BaseRequest, res: Response, next: NextFunction) {
    const dto: NoteGetOneDto = {
      id: req.params.id,
      userId: req.body.id,
    };
    const result = await NoteService.deleteItem(dto);
    res.json(result);
  }
}

export default new ExampleController();
