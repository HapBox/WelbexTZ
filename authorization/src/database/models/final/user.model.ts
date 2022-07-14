import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class User extends Model {
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public mail!: string;

  @Column({
    defaultValue: '',
  })
  public firstName!: string;

  @Column({
    defaultValue: '',
  })
  public lastName!: string;

  @Column({
    defaultValue: '',
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public password!: string;
}
