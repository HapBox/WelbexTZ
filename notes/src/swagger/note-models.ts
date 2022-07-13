export default class NoteModels {
  static reqNoteInfo = {
    id: 'UUID',
    name: 'Note name',
    description: 'Description',
  };

  static resNoteInfo = {
    id: 'UUID',
    name: 'Note name',
    description: 'Description',
  };

  static resNoteList = {
    noteList: [NoteModels.resNoteInfo],
  };
}
