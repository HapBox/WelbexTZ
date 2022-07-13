import { NoteCreateUpdateDto } from 'modules/dto/note-create-update.dto';
import { NoteGetOneDto } from 'modules/dto/note-get-one';
import { throwError } from 'utils/http-exception';

export default class NoteService {
  static async getNoteList(userId: string) {
    return 'GetList ok'
  }

  static async getNoteById(dto: NoteGetOneDto) {
    return 'GetOne ok'
  }

  static async createItem(dto: NoteCreateUpdateDto) {
    return 'Create ok'
  }

  static async updateItem(dto: NoteCreateUpdateDto) {
    return 'Update ok'
  }

  static async deleteItem(dto: NoteGetOneDto) {
    return 'Delete ok'
  }
}
