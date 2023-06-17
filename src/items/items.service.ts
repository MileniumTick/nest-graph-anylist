import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    try {
      const item = this.itemRepository.create(createItemInput);
      return await this.itemRepository.save(item);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.BAD_REQUEST, {
        cause: new Error(error.detail),
      });
    }
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string) {
    const item = await this.itemRepository.findOneBy({ id });

    if (!item) {
      throw new HttpException(
        'No se encontro el registro',
        HttpStatus.NOT_FOUND,
      );
    }
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.preload(updateItemInput);

    if (!item) {
      throw new HttpException(
        'No se encontro el registro',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.itemRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    const item = this.findOne(id);

    await this.itemRepository.delete(id);

    return item;
  }
}
