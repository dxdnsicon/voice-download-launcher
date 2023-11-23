import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('t_task')
export class TaskModel {
  @PrimaryGeneratedColumn('uuid')
  Ftask_id: string;

  @Column('varchar')
  Fname: string;

  @CreateDateColumn()
  Fcreate_time: string;

  @UpdateDateColumn()
  Fupdate_time: string;

  @Column()
  Fstatus: number;

  @Column({
    type: 'json',
    comment: '扩展信息',
  })
  Fjson: Array<any>;
}
