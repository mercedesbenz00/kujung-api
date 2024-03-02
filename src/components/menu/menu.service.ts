import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuListQueryDto } from './dto/menu-list-query.dto';
import { MenuTreeQueryDto } from './dto/menu-tree-query.dto';
import { Menu } from './entities/menu.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Menu)
    private menuTreeRepository: TreeRepository<Menu>, // @InjectDataSource() // private readonly dataSource: DataSource,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    try {
      const newMenu = new Menu();
      if (createMenuDto.parentId) {
        const parent = new Menu();
        parent.id = createMenuDto.parentId;
        newMenu.parent = parent;
      }
      newMenu.name = createMenuDto.name;
      newMenu.desc = createMenuDto.desc;
      newMenu.hidden = createMenuDto.hidden;

      return await this.menuRepository.save(newMenu);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(pageOptionsDto: MenuListQueryDto): Promise<PageDto<Menu>> {
    const queryBuilder = this.menuRepository.createQueryBuilder('menus_tree');

    if (pageOptionsDto.parentId) {
      queryBuilder.where('parentId = :id', { id: pageOptionsDto.parentId });
    } else {
      queryBuilder.where('parentId IS NULL');
    }
    queryBuilder
      .orderBy('seq', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
  filterTree = (tree, queryDto: MenuTreeQueryDto) => {
    const getNodes = (result, object) => {
      if (object.hidden === queryDto.hidden) {
        const newObject = { ...object };
        delete newObject.children;

        if (Array.isArray(object.children)) {
          const nodes = object.children.reduce(getNodes, []);
          if (nodes.length) newObject.children = nodes || [];
        }
        result.push(newObject);
        return result;
      }

      return result;
    };

    return tree.reduce(getNodes, []);
  };

  async getItemTreeList(queryDto: MenuTreeQueryDto) {
    const treeData = await this.menuTreeRepository.findTrees();

    if (queryDto.hidden === undefined) {
      return treeData;
    } else {
      const newTree = this.filterTree(treeData, queryDto);
      return newTree;
    }
  }

  findOne(id: number): Promise<Menu> {
    return this.menuRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    try {
      const menu = await this.findOne(id);
      if (menu) {
        if (updateMenuDto.parentId) {
          const parent = new Menu();
          parent.id = updateMenuDto.parentId;
          menu.parent = parent;
        } else if (updateMenuDto.parentId === null) {
          menu.parent = null;
        }

        if (updateMenuDto.desc !== undefined) {
          menu.desc = updateMenuDto.desc;
        }

        if (updateMenuDto.name !== undefined) {
          menu.name = updateMenuDto.name;
        }

        if (updateMenuDto.hidden !== undefined) {
          menu.hidden = updateMenuDto.hidden;
        }
        return await this.menuRepository.save(menu);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }
  async remove(id: number) {
    return await this.menuRepository.delete(id);
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.menuRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
