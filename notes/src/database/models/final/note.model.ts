import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export default class Note extends Model {
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public userId!: string;
}
