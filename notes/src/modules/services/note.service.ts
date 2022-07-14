import Note from 'database/models/final/note.model';
import { NoteCreateUpdateDto } from 'modules/dto/note-create-update.dto';
import { NoteGetOneDto } from 'modules/dto/note-get-one';
import { throwError } from 'utils/http-exception';

export default class NoteService {
  static async getNoteList(userId: string) {
    const noteList = await Note.findAll({
      where: {
        userId: userId,
      },
    });

    return noteList;
  }

  static async getNoteById(dto: NoteGetOneDto) {
    const note = await Note.findOne({
      where: {
        userId: dto.userId,
        id: dto.id,
      },
    });

    if (!note) {
      throwError({
        statusCode: 404,
        message: 'Not found',
      });
    }
    return note;
  }

  static async createNote(dto: NoteCreateUpdateDto) {
    const note = await Note.create({ ...dto });
    return note;
  }

  static async updateNote(dto: NoteCreateUpdateDto) {
    const note = await Note.findOne({
      where: {
        userId: dto.userId,
        id: dto.id,
      },
    });

    if (!note) {
      throwError({
        statusCode: 404,
        message: 'Not found',
      });
    }

    note.update({ ...dto });
    return note;
  }

  static async deleteNote(dto: NoteGetOneDto) {
    const note = await Note.findOne({
      where: {
        userId: dto.userId,
        id: dto.id,
      },
    });

    if (!note) {
      throwError({
        statusCode: 404,
        message: 'Not found',
      });
    }

    await note.destroy();
    return 'Note destroyed';
  }
}
