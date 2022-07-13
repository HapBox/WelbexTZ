import Item from 'database/models/final/item.model';
import { CreateItemDto } from 'modules/dto/create-item.dto';
import { UserCreateDto } from 'modules/dto/update-item.dto';
import { throwError } from 'utils/http-exception';

export default class ExampleService {
  static async getItems() {
    return await Item.findAll();
  }

  static async getItemById(id: string) {
    const item = await Item.findByPk(id);

    if (!item) {
      throwError({
        statusCode: 404,
        message: `Item with id# ${id} was not found`,
      });
    }

    return item;
  }

  static async createItem(dto: CreateItemDto) {
    const item = await Item.create({ ...dto });

    return item;
  }

  static async updateItem(id: string, dto: UserCreateDto) {
    const item = await this.getItemById(id);

    await item.update(dto);

    return item;
  }

  static async deleteItem(id: string) {
    const item = await this.getItemById(id);

    await item.destroy();
  }
}
