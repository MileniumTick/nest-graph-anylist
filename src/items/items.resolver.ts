import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => String }) id: string) {
    return this.itemsService.remove(id);
  }
}
