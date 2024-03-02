import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryListQueryDto } from './dto/category-list-query.dto';
import { CategoryTreeQueryDto } from './dto/category-tree-query.dto';
import { Category } from './entities/category.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { CategoryImage } from './entities/category-image.entity';
import { CategoryYoutube } from './entities/category-youtube.entity';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { getYoutubeThumbUrl } from './../../shared/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryImage)
    private categoryImageRepository: Repository<CategoryImage>,
    @InjectRepository(CategoryYoutube)
    private categoryYoutubeRepository: Repository<CategoryYoutube>,
    @InjectRepository(Category)
    private categoryTreeRepository: TreeRepository<Category>, // @InjectDataSource() // private readonly dataSource: DataSource,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = new Category();
      if (createCategoryDto.parentId) {
        const parent = new Category();
        parent.id = createCategoryDto.parentId;
        newCategory.parent = parent;
      }
      newCategory.name = createCategoryDto.name;
      newCategory.depth = createCategoryDto.depth;
      newCategory.image_url = createCategoryDto.image_url;
      newCategory.desc = createCategoryDto.desc;
      newCategory.tags = createCategoryDto.tags;
      newCategory.hidden = createCategoryDto.hidden;

      if (createCategoryDto.categoryImages) {
        newCategory.categoryImages = [];
        for (const categoryImage of createCategoryDto.categoryImages) {
          const categoryImageEntity = new CategoryImage();
          categoryImageEntity.image_url = categoryImage.image_url;
          newCategory.categoryImages.push(categoryImageEntity);
        }
      }

      if (createCategoryDto.categoryYoutubes) {
        newCategory.categoryYoutubes = [];
        for (const categoryYoutube of createCategoryDto.categoryYoutubes) {
          const categoryYoutubeEntity = new CategoryYoutube();

          categoryYoutubeEntity.summary = categoryYoutube.summary;
          categoryYoutubeEntity.thumb_url = getYoutubeThumbUrl(
            categoryYoutube.url,
          );
          categoryYoutubeEntity.title = categoryYoutube.title;
          categoryYoutubeEntity.url = categoryYoutube.url;
          newCategory.categoryYoutubes.push(categoryYoutubeEntity);
        }
      }
      return await this.categoryRepository.save(newCategory);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: CategoryListQueryDto,
  ): Promise<PageDto<Category>> {
    const queryBuilder =
      this.categoryRepository.createQueryBuilder('categories_tree');

    if (pageOptionsDto.parentId) {
      queryBuilder.where('parentId = :id', { id: pageOptionsDto.parentId });
    } else {
      queryBuilder.where('parentId IS NULL');
    }
    queryBuilder.relation('categoryImages');
    queryBuilder.relation('categoryYoutubes');
    queryBuilder
      .orderBy(pageOptionsDto.sortBy, pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const totalCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
  filterTree = (tree, queryDto: CategoryTreeQueryDto) => {
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

  async getItemTreeList(queryDto: CategoryTreeQueryDto) {
    const treeData = await this.categoryTreeRepository.findTrees({
      relations: ['categoryImages', 'categoryYoutubes', 'parent'],
    });

    if (queryDto.hidden === undefined) {
      return treeData;
    } else {
      const newTree = this.filterTree(treeData, queryDto);
      return newTree;
    }
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id: id },
      relations: {
        categoryImages: true,
        categoryYoutubes: true,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.findOne(id);
      if (category) {
        if (updateCategoryDto.parentId) {
          const parent = new Category();
          parent.id = updateCategoryDto.parentId;
          category.parent = parent;
        } else if (updateCategoryDto.parentId === null) {
          category.parent = null;
        }

        if (updateCategoryDto.desc !== undefined) {
          category.desc = updateCategoryDto.desc;
        }

        if (updateCategoryDto.name !== undefined) {
          category.name = updateCategoryDto.name;
        }

        if (updateCategoryDto.depth !== undefined) {
          category.depth = updateCategoryDto.depth;
        }

        if (updateCategoryDto.image_url !== undefined) {
          category.image_url = updateCategoryDto.image_url;
        }

        if (updateCategoryDto.tags !== undefined) {
          category.tags = updateCategoryDto.tags;
        }

        if (updateCategoryDto.hidden !== undefined) {
          category.hidden = updateCategoryDto.hidden;
        }

        if (updateCategoryDto.categoryImages) {
          if (category.categoryImages) {
            // Find the images to remove
            const imagesToRemove = category.categoryImages.filter(
              (existingImage) => {
                return !updateCategoryDto.categoryImages.some(
                  (newImage) => newImage.id === existingImage.id,
                );
              },
            );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.categoryImageRepository.remove(imagesToRemove);
            }
          }
          category.categoryImages = [];
          for (const categoryImage of updateCategoryDto.categoryImages) {
            const categoryImageEntity = new CategoryImage();
            if (categoryImage.id) {
              categoryImageEntity.id = categoryImage.id;
            }
            categoryImageEntity.image_url = categoryImage.image_url;
            category.categoryImages.push(categoryImageEntity);
          }
        }

        if (updateCategoryDto.categoryYoutubes) {
          if (category.categoryYoutubes) {
            // Find the images to remove
            const youtubesToRemove = category.categoryYoutubes.filter(
              (existingYoutube) => {
                return !updateCategoryDto.categoryYoutubes.some(
                  (newYoutube) => newYoutube.id === existingYoutube.id,
                );
              },
            );

            // Delete the images that are no longer associated with the entity
            if (youtubesToRemove.length) {
              await this.categoryYoutubeRepository.remove(youtubesToRemove);
            }
          }
          category.categoryYoutubes = [];
          for (const categoryYoutube of updateCategoryDto.categoryYoutubes) {
            const categoryYoutubeEntity = new CategoryYoutube();

            if (categoryYoutube.id) {
              categoryYoutubeEntity.id = categoryYoutube.id;
            }
            categoryYoutubeEntity.summary = categoryYoutube.summary;
            categoryYoutubeEntity.thumb_url = getYoutubeThumbUrl(
              categoryYoutube.url,
            );
            categoryYoutubeEntity.title = categoryYoutube.title;
            categoryYoutubeEntity.url = categoryYoutube.url;
            category.categoryYoutubes.push(categoryYoutubeEntity);
          }
        }
        return await this.categoryRepository.save(category);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }
  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.categoryRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
