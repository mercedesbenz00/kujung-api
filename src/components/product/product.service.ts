import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  Repository,
  ILike,
  Between,
  In,
  Not,
  LessThan,
  MoreThan,
  Brackets,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { EntityIdArrayDto } from '../tag/dto/create-tag.dto';
import { QuerySimilarProductDto } from './dto/query-similar-product.dto';
import { Product } from './entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import { CommonConstant } from '../common-constant/entities/common-constant.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { ProductImage } from './entities/product-image.entity';
import { ProductBlog } from './entities/product-blog.entity';
import { ProductYoutube } from './entities/product-youtube.entity';
import { ProductPopularity } from './entities/product-popularity.entity';
import { getYoutubeThumbUrl } from './../../shared/utils';
import { Order, ViewLogEntityType } from '../../shared/constants';
import { Wish } from '../wish/entities/wish.entity';
import { WishEntityType } from 'src/shared/constants';
import { ViewLogService } from '../view-log/view-log.service';

@Injectable()
export class ProductService {
  constructor(
    private viewLogService: ViewLogService,
    private usersService: UsersService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductPopularity)
    private productPopularityRepository: Repository<ProductPopularity>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}
  async create(createProductDto: CreateProductDto, userId: number = undefined) {
    try {
      const newProduct = new Product();
      newProduct.title = createProductDto.title;

      const category1 = new Category();
      category1.id = createProductDto.category_level1_id;
      newProduct.category_level1 = category1;

      if (createProductDto.category_level2_id !== undefined) {
        const category2 = new Category();
        category2.id = createProductDto.category_level2_id;
        newProduct.category_level2 = category2;
      }

      if (createProductDto.category_level3_id !== undefined) {
        const category3 = new Category();
        category3.id = createProductDto.category_level3_id;
        newProduct.category_level3 = category3;
      }
      newProduct.construction_law = createProductDto.construction_law;
      newProduct.size_w = createProductDto.size_w;
      newProduct.size_l = createProductDto.size_l;
      newProduct.size_t = createProductDto.size_t;
      newProduct.desc = createProductDto.desc;
      newProduct.view_point = createProductDto.view_point;
      if (createProductDto.family_type_code !== undefined) {
        newProduct.family_type_info = new CommonConstant();
        newProduct.family_type_info.id = createProductDto.family_type_code;
      }
      if (createProductDto.color_code !== undefined) {
        newProduct.color_info = new CommonConstant();
        newProduct.color_info.id = createProductDto.color_code;
      }
      if (createProductDto.house_style_code !== undefined) {
        newProduct.house_style_info = new CommonConstant();
        newProduct.house_style_info.id = createProductDto.house_style_code;
      }
      if (createProductDto.house_type_code !== undefined) {
        newProduct.house_type_info = new CommonConstant();
        newProduct.house_type_info.id = createProductDto.house_type_code;
      }
      if (createProductDto.area_space_code !== undefined) {
        newProduct.area_space_info = new CommonConstant();
        newProduct.area_space_info.id = createProductDto.area_space_code;
      }
      newProduct.tags = [];
      newProduct.similarProducts = [];

      if (createProductDto.tags) {
        for (const tag of createProductDto.tags) {
          const tagEntity = new Tag();
          tagEntity.id = tag.id;
          newProduct.tags.push(tagEntity);
        }
      }

      if (createProductDto.similarProductIds) {
        for (const smProductId of createProductDto.similarProductIds) {
          const smProductEntity = new Product();
          smProductEntity.id = smProductId;
          newProduct.similarProducts.push(smProductEntity);
        }
      }
      newProduct.thumbnail_url = createProductDto.thumbnail_url;
      if (createProductDto.detail_info) {
        const contentBuffer = Buffer.from(
          createProductDto.detail_info,
          'utf-8',
        );
        newProduct.detail_info = contentBuffer;
      }

      newProduct.productImages = [];
      for (const productImage of createProductDto.productImages) {
        const productImageEntity = new ProductImage();
        productImageEntity.image_url = productImage.image_url;
        newProduct.productImages.push(productImageEntity);
      }

      newProduct.productBlogs = [];
      if (createProductDto.productBlogs) {
        for (const productBlog of createProductDto.productBlogs) {
          const productBlogEntity = new ProductBlog();
          productBlogEntity.summary = productBlog.summary;
          productBlogEntity.thumb_url = productBlog.thumb_url;
          productBlogEntity.title = productBlog.title;
          productBlogEntity.url = productBlog.url;
          newProduct.productBlogs.push(productBlogEntity);
        }
      }

      if (createProductDto.productYoutube) {
        newProduct.productYoutube = new ProductYoutube();
        newProduct.productYoutube.summary =
          createProductDto.productYoutube.summary;
        newProduct.productYoutube.thumb_url = getYoutubeThumbUrl(
          createProductDto.productYoutube.url,
        );
        newProduct.productYoutube.title = createProductDto.productYoutube.title;
        newProduct.productYoutube.url = createProductDto.productYoutube.url;
      }
      newProduct.selected_icons = createProductDto.selected_icons;
      newProduct.hidden = createProductDto.hidden;
      if (userId !== undefined) {
        newProduct.created_by = userId;
      }

      return await this.productRepository.save(newProduct);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  private getProductEntity(entity: any) {
    if (entity.category_level1) {
      entity.category_level1 = JSON.parse(entity.category_level1);
    }
    if (entity.category_level2) {
      entity.category_level2 = JSON.parse(entity.category_level2);
    }
    if (entity.category_level3) {
      entity.category_level3 = JSON.parse(entity.category_level3);
    }
    if (entity.productBlogs) {
      entity.productBlogs = JSON.parse(entity.productBlogs);
      entity.productBlogs = entity.productBlogs.reduce((newBlogs, value) => {
        const blogId = value.id;
        if (blogId) {
          const exist = newBlogs.find((pb) => pb.id === blogId);
          if (!exist) {
            newBlogs.push(value);
          }
        }
        return newBlogs;
      }, []);
    }
    if (entity.productImages) {
      entity.productImages = JSON.parse(entity.productImages);
      entity.productImages = entity.productImages.reduce((newImages, value) => {
        const imageId = value.id;
        if (imageId) {
          const exist = newImages.find((pb) => pb.id === imageId);
          if (!exist) {
            newImages.push(value);
          }
        }
        return newImages;
      }, []);
    }
    if (entity.productYoutube) {
      entity.productYoutube = JSON.parse(entity.productYoutube);
    }
    if (entity.tags) {
      entity.tags = JSON.parse(entity.tags);
    }
    if (entity.color_info && entity.color_info.id) {
      entity.color_info = JSON.parse(entity.color_info);
    } else {
      entity.color_info = null;
    }
    if (entity.area_space_info) {
      entity.area_space_info = JSON.parse(entity.area_space_info);
    }
    if (entity.house_style_info) {
      entity.house_style_info = JSON.parse(entity.house_style_info);
    }
    if (entity.family_type_info) {
      entity.family_type_info = JSON.parse(entity.family_type_info);
    }
    if (entity.house_type_info) {
      entity.house_type_info = JSON.parse(entity.house_type_info);
    }
    return entity;
  }

  async getItemList(
    pageOptionsDto: SearchProductDto,
    userInfo: any = null,
  ): Promise<PageDto<Product>> {
    const whereQueryList = [];
    const orderBy = pageOptionsDto.sortBy || 'id';
    const queryDateType = 'created_at';
    if (pageOptionsDto.from && pageOptionsDto.to) {
      whereQueryList.push(
        `p.${queryDateType} BETWEEN ${new Date(
          pageOptionsDto.from,
        )} AND ${new Date(pageOptionsDto.to)}`,
      );
    } else if (pageOptionsDto.from) {
      whereQueryList.push(
        `p.${queryDateType} >= ${new Date(pageOptionsDto.from)}`,
      );
    } else if (pageOptionsDto.to) {
      whereQueryList.push(
        `p.${queryDateType} <= ${new Date(pageOptionsDto.to)}`,
      );
    }
    if (pageOptionsDto.q !== undefined) {
      const queryType = pageOptionsDto.q_type || 'title';
      if (queryType === 'title') {
        whereQueryList.push(
          `(LOWER(p.title) LIKE LOWER('%${pageOptionsDto.q}%') OR LOWER(tags_tb.name) LIKE LOWER('%${pageOptionsDto.q}%')
          OR LOWER(query_cat1.name) LIKE LOWER('%${pageOptionsDto.q}%') OR LOWER(query_cat2.name) LIKE LOWER('%${pageOptionsDto.q}%'))`,
        );
      } else {
        whereQueryList.push(
          `LOWER(p.${pageOptionsDto.q_type}) LIKE LOWER('%${pageOptionsDto.q}%')`,
        );
      }
    }
    if (pageOptionsDto.category_level1_id !== undefined) {
      whereQueryList.push(`cat1.id = ${pageOptionsDto.category_level1_id}`);
    }
    if (pageOptionsDto.category_level2_id !== undefined) {
      whereQueryList.push(`cat2.id = ${pageOptionsDto.category_level2_id}`);
    }
    if (pageOptionsDto.category_level3_id !== undefined) {
      whereQueryList.push(`cat3.id = ${pageOptionsDto.category_level3_id}`);
    }
    if (pageOptionsDto.hidden !== undefined) {
      whereQueryList.push(`p.hidden = ${pageOptionsDto.hidden}`);
    }
    if (pageOptionsDto.recommended !== undefined) {
      whereQueryList.push(`p.recommended = ${pageOptionsDto.recommended}`);
    }
    if (pageOptionsDto.top_fixed !== undefined) {
      whereQueryList.push(`p.top_fixed = ${pageOptionsDto.top_fixed}`);
    }
    if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
      whereQueryList.push(
        `tags_tb.id IN (${pageOptionsDto.tags
          .map((tag) => `'${tag}'`)
          .join(',')})`,
      );
    }
    if (pageOptionsDto.exclude_product_id !== undefined) {
      whereQueryList.push(`p.id != ${pageOptionsDto.exclude_product_id}`);
    }

    if (
      pageOptionsDto.area_space_list &&
      pageOptionsDto.area_space_list.length
    ) {
      whereQueryList.push(
        `p.area_space_code IN (${pageOptionsDto.area_space_list
          .map((area_code) => `'${area_code}'`)
          .join(',')})`,
      );
    }
    if (pageOptionsDto.color_list && pageOptionsDto.color_list.length) {
      whereQueryList.push(
        `p.color_code IN (${pageOptionsDto.color_list
          .map((color_code) => `'${color_code}'`)
          .join(',')})`,
      );
    }
    if (
      pageOptionsDto.house_type_list &&
      pageOptionsDto.house_type_list.length
    ) {
      whereQueryList.push(
        `p.house_type_code IN (${pageOptionsDto.house_type_list
          .map((house_type_code) => `'${house_type_code}'`)
          .join(',')})`,
      );
    }
    if (pageOptionsDto.style_list && pageOptionsDto.style_list.length) {
      whereQueryList.push(
        `p.house_style_code IN (${pageOptionsDto.style_list
          .map((house_style_code) => `'${house_style_code}'`)
          .join(',')})`,
      );
    }
    if (
      pageOptionsDto.family_type_list &&
      pageOptionsDto.family_type_list.length
    ) {
      whereQueryList.push(
        `p.family_type_code IN (${pageOptionsDto.family_type_list
          .map((family_type_code) => `'${family_type_code}'`)
          .join(',')})`,
      );
    }
    const sqlQuery = `
    SELECT
      p.id,
      p.title,
      p.construction_law,
      p.size_w,
      p.size_l,
      p.size_t,
      p.view_point,
      p.desc,
      p.selected_icons,
      p.hidden,
      p.recommended,
      p.top_fixed,
      p.wish_count,
      p.view_count,
      p.thumbnail_url,
      p.created_at,
      p.updated_at,
      p.seq,
      CASE
      WHEN cat1.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', cat1.id,
          'name', cat1.name
        )
      ELSE NULL
      END AS category_level1,
      CASE
        WHEN cat2.id IS NOT NULL THEN 
          JSON_OBJECT(
            'id', cat2.id,
            'name', cat2.name
          )
        ELSE NULL
      END AS category_level2,
      CASE
        WHEN cat3.id IS NOT NULL THEN 
          JSON_OBJECT(
            'id', cat3.id,
            'name', cat3.name
          )
        ELSE NULL
      END AS category_level3,
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', p_blog.id,
        'title', p_blog.title,
        'url', p_blog.url,
        'thumb_url', p_blog.thumb_url
      )) AS productBlogs,
      CASE
        WHEN p_youtube.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', p_youtube.id,
          'title', p_youtube.title,
          'url', p_youtube.url,
          'thumb_url', p_youtube.thumb_url
        )
        ELSE NULL
      END AS productYoutube,
      popular.popularity_point as popularity,
      popular.this_month_count as this_month_count,
      JSON_ARRAYAGG(JSON_OBJECT(
        'id', p_images.id,
        'image_url', p_images.image_url
      )) AS productImages,
      (
        SELECT COALESCE(
          JSON_ARRAYAGG(JSON_OBJECT(
          'id', ts.id,
          'name', ts.name
          )), JSON_ARRAY())
        FROM product_tags pt
        LEFT JOIN tags ts ON pt.tag_id = ts.id
        WHERE pt.product_id = p.id
      )
      AS tags,
      CASE
        WHEN c_color.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', c_color.id,
          'name', c_color.name,
          'type', c_color.type
        )
        ELSE NULL
      END AS color_info,
      CASE
        WHEN c_area_space.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', c_area_space.id,
          'name', c_area_space.name,
          'type', c_area_space.type
        )
        ELSE NULL
      END AS area_space_info,
      CASE
        WHEN c_house_style.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', c_house_style.id,
          'name', c_house_style.name,
          'type', c_house_style.type
        )
        ELSE NULL
      END AS house_style_info,
      CASE
        WHEN c_family_type.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', c_family_type.id,
          'name', c_family_type.name,
          'type', c_family_type.type
        )
        ELSE NULL
      END AS family_type_info,
      CASE
        WHEN c_house_type.id IS NOT NULL THEN 
        JSON_OBJECT(
          'id', c_house_type.id,
          'name', c_house_type.name,
          'type', c_house_type.type
        )
        ELSE NULL
      END AS house_type_info
    FROM products p
    LEFT JOIN product_blogs p_blog ON p.id = p_blog.product_id
    LEFT JOIN product_youtubes p_youtube ON p.id = p_youtube.product_id
    LEFT JOIN product_popularity popular ON p.id = popular.entity_id
    LEFT JOIN product_images p_images ON p.id = p_images.product_id
    LEFT JOIN categories_tree cat1 ON cat1.id = p.category_level1_id
    LEFT JOIN categories_tree cat2 ON cat2.id = p.category_level2_id
    LEFT JOIN categories_tree cat3 ON cat3.id = p.category_level3_id
    LEFT JOIN categories_tree query_cat1 ON query_cat1.id = p.category_level1_id
    LEFT JOIN categories_tree query_cat2 ON query_cat2.id = p.category_level2_id
    LEFT JOIN product_tags p_tags ON p.id = p_tags.product_id
    LEFT JOIN tags tags_tb ON tags_tb.id = p_tags.tag_id
    LEFT JOIN common_constants c_color ON c_color.id = p.color_code
    LEFT JOIN common_constants c_area_space ON c_area_space.id = p.area_space_code
    LEFT JOIN common_constants c_family_type ON c_family_type.id = p.family_type_code
    LEFT JOIN common_constants c_house_style ON c_house_style.id = p.house_style_code
    LEFT JOIN common_constants c_house_type ON c_house_type.id = p.house_type_code
    ${whereQueryList.length ? 'WHERE ' + whereQueryList.join(' AND ') : ''}
      GROUP BY
        p.id
    `;

    const orderByField =
      orderBy === 'popularity' ? `popularity` : `p.${orderBy}`;
    let query = '';
    if (userInfo && userInfo.roles && userInfo.roles.includes('admin')) {
      query = `
          ${sqlQuery}
          ORDER BY ${orderByField} ${pageOptionsDto.order}
        `;
    } else {
      query = `
          ${sqlQuery}
          ORDER BY p.top_fixed DESC, ${orderByField} ${pageOptionsDto.order}
        `;
    }

    if (pageOptionsDto.take) {
      query = `${query}
      LIMIT ${pageOptionsDto.take}
      OFFSET ${pageOptionsDto.skip};
      `;
    }

    const totalCountQuery = `
    SELECT COUNT(*) AS total_count
    FROM (${sqlQuery}) A
    `;

    const totalCountQueryResult = await this.productRepository.query(
      totalCountQuery,
    );
    const totalCount = Number(totalCountQueryResult[0].total_count);

    const productList = await this.productRepository.query(query);

    const entities = productList.reduce((newArray, row) => {
      const entity = this.getProductEntity(row);

      if (entity.id) {
        newArray.push(entity);
      }
      return newArray;
    }, []);

    if (
      entities.length &&
      userInfo &&
      userInfo.roles &&
      userInfo.roles.includes('user')
    ) {
      // wish status
      const userEntityWishes = await this.wishRepository
        .createQueryBuilder('wish_items')
        .where('wish_items.entity_id IN (:...ids)', {
          ids: entities.map((entity) => entity.id),
        })
        .andWhere(`wish_items.user_id = :user_id`, {
          user_id: userInfo.id,
        })
        .andWhere(`wish_items.type = :type`, {
          type: WishEntityType.Product,
        })
        .getMany();

      entities.forEach((entity) => {
        const userEntityWish = userEntityWishes.find(
          (wish) => wish.entity_id === entity.id,
        );
        entity.wished = userEntityWish ? true : false;
      });
    }

    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.productRepository.count();
    }
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
    // return this.productRepository.find();
  }

  async getItemListDeprecated(
    pageOptionsDto: SearchProductDto,
    userInfo: any = null,
  ): Promise<PageDto<Product>> {
    const orderBy = pageOptionsDto.sortBy || 'id';

    let query = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.productBlogs', 'productBlogs')
      .leftJoinAndSelect('products.productYoutube', 'productYoutube')
      .leftJoinAndSelect('products.productPopularity', 'productPopularity')
      .leftJoinAndSelect('products.productImages', 'productImages')
      .leftJoinAndSelect('products.category_level1', 'category_level1')
      .leftJoinAndSelect('products.category_level2', 'category_level2')
      .leftJoinAndSelect('products.category_level3', 'category_level3')
      .leftJoinAndSelect('products.tags', 'query_tags')
      .leftJoinAndSelect('products.tags', 'tags')
      .leftJoinAndSelect('products.color_info', 'color_info')
      .leftJoinAndSelect('products.area_space_info', 'area_space_info')
      .leftJoinAndSelect('products.house_style_info', 'house_style_info')
      .leftJoinAndSelect('products.family_type_info', 'family_type_info')
      .leftJoinAndSelect('products.house_type_info', 'house_type_info')
      .select([
        'products.id',
        'products.title',
        'products.construction_law',
        'products.size_w',
        'products.size_l',
        'products.size_t',
        'products.view_point',
        'products.desc',
        'products.selected_icons',
        'products.hidden',
        'products.recommended',
        'products.top_fixed',
        'products.wish_count',
        'products.view_count',
        'products.thumbnail_url',
        'products.created_at',
        'products.updated_at',
        'category_level1',
        'category_level2',
        'category_level3',
        'productBlogs',
        'productYoutube',
        'productPopularity',
        'productImages',
        'tags',
        'color_info',
        'area_space_info',
        'house_style_info',
        'family_type_info',
        'house_type_info',
      ]);
    if (pageOptionsDto.q !== undefined) {
      const queryType = pageOptionsDto.q_type || 'title';
      if (queryType === 'title') {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where(`LOWER(products.${queryType}) LIKE LOWER(:${queryType})`, {
              [queryType]: `%${pageOptionsDto.q}%`,
            }).orWhere('LOWER(query_tags.name) LIKE LOWER(:tag_name)', {
              tag_name: `%${pageOptionsDto.q}%`,
            });
          }),
        );
      } else {
        query = query.andWhere(
          `LOWER(products.${queryType}) LIKE LOWER(:${queryType})`,
          {
            [queryType]: `%${pageOptionsDto.q}%`,
          },
        );
      }
    }

    if (pageOptionsDto.category_level1_id !== undefined) {
      query = query.andWhere(`category_level1.id = :category_level1_id`, {
        category_level1_id: pageOptionsDto.category_level1_id,
      });
    }

    if (pageOptionsDto.category_level2_id !== undefined) {
      query = query.andWhere(`category_level2.id = :category_level2_id`, {
        category_level2_id: pageOptionsDto.category_level2_id,
      });
    }

    if (pageOptionsDto.category_level3_id !== undefined) {
      query = query.andWhere(`category_level3.id = :category_level3_id`, {
        category_level3_id: pageOptionsDto.category_level3_id,
      });
    }

    if (pageOptionsDto.tags && pageOptionsDto.tags.length) {
      query = query.andWhere(`query_tags.id IN (:...tags)`, {
        tags: pageOptionsDto.tags,
      });
    }

    const queryDateType = 'created_at';
    if (pageOptionsDto.from && pageOptionsDto.to) {
      query = query.andWhere(
        `products.${queryDateType} BETWEEN :from AND :to`,
        {
          from: new Date(pageOptionsDto.from),
          to: new Date(pageOptionsDto.to),
        },
      );
    } else if (pageOptionsDto.from) {
      query = query.andWhere(`products.${queryDateType} >= :from`, {
        from: new Date(pageOptionsDto.from),
      });
    } else if (pageOptionsDto.to) {
      query = query.andWhere(`products.${queryDateType} <= :to`, {
        to: new Date(pageOptionsDto.to),
      });
    }

    if (pageOptionsDto.hidden !== undefined) {
      query = query.andWhere(`products.hidden = :hidden`, {
        hidden: pageOptionsDto.hidden,
      });
    }

    if (pageOptionsDto.recommended !== undefined) {
      query = query.andWhere(`products.recommended = :recommended`, {
        recommended: pageOptionsDto.recommended,
      });
    }

    if (pageOptionsDto.top_fixed !== undefined) {
      query = query.andWhere(`products.top_fixed = :top_fixed`, {
        top_fixed: pageOptionsDto.top_fixed,
      });
    }

    if (
      pageOptionsDto.area_space_list &&
      pageOptionsDto.area_space_list.length
    ) {
      query = query.andWhere(`area_space_info.id IN (:...area_space_list)`, {
        area_space_list: pageOptionsDto.area_space_list,
      });
    }

    if (pageOptionsDto.color_list && pageOptionsDto.color_list.length) {
      query = query.andWhere(`color_info.id IN (:...color_list)`, {
        color_list: pageOptionsDto.color_list,
      });
    }

    if (
      pageOptionsDto.house_type_list &&
      pageOptionsDto.house_type_list.length
    ) {
      query = query.andWhere(`house_type_info.id IN (:...house_type_list)`, {
        house_type_list: pageOptionsDto.house_type_list,
      });
    }

    if (pageOptionsDto.style_list && pageOptionsDto.style_list.length) {
      query = query.andWhere(`house_style_info.id IN (:...style_list)`, {
        style_list: pageOptionsDto.style_list,
      });
    }

    if (
      pageOptionsDto.family_type_list &&
      pageOptionsDto.family_type_list.length
    ) {
      query = query.andWhere(`family_type_info.id IN (:...family_type_list)`, {
        family_type_list: pageOptionsDto.family_type_list,
      });
    }

    const orderByField =
      orderBy === 'popularity'
        ? `productPopularity.popularity_point`
        : `products.${orderBy}`;
    query = pageOptionsDto.take
      ? query
          .skip(pageOptionsDto.skip)
          .take(pageOptionsDto.take)
          .orderBy('products.top_fixed', 'DESC')
          .addOrderBy(orderByField, pageOptionsDto.order)
      : query
          .orderBy('products.top_fixed', 'DESC')
          .addOrderBy(orderByField, pageOptionsDto.order);

    const [entities, totalCount] = await query.getManyAndCount();
    if (
      entities.length &&
      userInfo &&
      userInfo.roles &&
      userInfo.roles.includes('user')
    ) {
      // wish status
      const userEntityWishes = await this.wishRepository
        .createQueryBuilder('wish_items')
        .where('wish_items.entity_id IN (:...ids)', {
          ids: entities.map((entity) => entity.id),
        })
        .andWhere(`wish_items.user_id = :user_id`, {
          user_id: userInfo.id,
        })
        .andWhere(`wish_items.type = :type`, {
          type: WishEntityType.Product,
        })
        .getMany();

      entities.forEach((entity) => {
        const userEntityWish = userEntityWishes.find(
          (wish) => wish.entity_id === entity.id,
        );
        entity.userWished = userEntityWish ? true : false;
      });
    }

    let allCount = undefined;
    if (pageOptionsDto.needAllCount) {
      allCount = await this.productRepository.count();
    }
    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto,
      allCount,
    });

    return new PageDto(entities, pageMetaDto);
    // return this.productRepository.find();
  }

  async getSimilarProductList(
    pageOptionsDto: QuerySimilarProductDto,
  ): Promise<PageDto<Product>> {
    const whereCondition: any = [];
    const product = await this.findOne(pageOptionsDto.id);

    if (product) {
      const sqlQueryInfo: FindManyOptions = {
        order: {
          [pageOptionsDto.sortBy ? pageOptionsDto.sortBy : 'created_at']:
            pageOptionsDto.order,
          updated_at: Order.DESC,
        },
        relations: {
          productBlogs: true,
          productYoutube: true,
          productImages: true,
          tags: true,
        },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      };

      whereCondition.push({
        style: product.style,
        id: Not(product.id),
      });
      whereCondition.push({
        color: product.color,
        id: Not(product.id),
      });

      sqlQueryInfo.where = whereCondition;
      const [entities, totalCount] = await this.productRepository.findAndCount(
        sqlQueryInfo,
      );
      const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    }
    return null;
  }

  async findOne(
    id: number,
    needUserInfo = true,
    userInfo: any = null,
    canUpdateViewCount = false,
    needConvert = false,
  ): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'title',
        'construction_law',
        'size_w',
        'size_l',
        'size_t',
        'view_point',
        'desc',
        'selected_icons',
        'hidden',
        'recommended',
        'top_fixed',
        'wish_count',
        'view_count',
        'thumbnail_url',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
      ],
      relations: {
        productBlogs: true,
        productYoutube: true,
        productPopularity: true,
        productImages: true,
        tags: true,
        color_info: true,
        area_space_info: true,
        house_style_info: true,
        family_type_info: true,
        house_type_info: true,
        category_level1: true,
        category_level2: true,
        category_level3: true,
        similarProducts: {
          tags: true,
          category_level1: true,
          category_level2: true,
          category_level3: true,
        },
      },
    });
    if (product) {
      const productDetailEntity = await this.productRepository.findOne({
        where: { id: id },
        select: ['detail_info'],
      });
      product.detail_info = productDetailEntity.detail_info;
    }

    if (
      product &&
      canUpdateViewCount &&
      ((userInfo && userInfo.roles && userInfo.roles.includes('user')) ||
        !userInfo)
    ) {
      await this.viewLogService.updateViewLog(userInfo?.id, {
        type: ViewLogEntityType.Product,
        entity_id: id,
      });
      let productPopularity = product.productPopularity;
      // update product popularity
      if (productPopularity) {
        productPopularity.this_month_count =
          Number(productPopularity.this_month_count) + 1;
      } else {
        productPopularity = new ProductPopularity();
        productPopularity.product = new Product();
        productPopularity.product.id = id;
        productPopularity.this_month_count = 1;
      }
      await this.productPopularityRepository.save(productPopularity);
      if (userInfo) {
        const userEntityWish = await this.wishRepository
          .createQueryBuilder('wish_items')
          .where('wish_items.entity_id = :entity_id', {
            entity_id: id,
          })
          .andWhere(`wish_items.user_id = :user_id`, {
            user_id: userInfo.id,
          })
          .andWhere(`wish_items.type = :type`, {
            type: WishEntityType.Product,
          })
          .getOne();
        product.userWished = userEntityWish ? true : false;
      }
    }
    if (needUserInfo && product) {
      let updated_by = null;
      let created_by = null;
      if (product) {
        if (product.updated_by) {
          const modifier = await this.usersService.getUserInfo(
            product.updated_by,
          );
          if (modifier) {
            updated_by = modifier.name;
          }
        }
        if (product.created_by) {
          const creator = await this.usersService.getUserInfo(
            product.created_by,
          );
          if (creator) {
            created_by = creator.name;
          }
        }
        product.created_by = created_by;
        product.updated_by = updated_by;
        if (needConvert && product && product.detail_info) {
          const contentString = product.detail_info?.toString('utf-8');
          return {
            ...product,
            detail_info: contentString,
          };
        }
        return product;
      }
    }
    if (needConvert && product && product.detail_info) {
      const contentString = product.detail_info?.toString('utf-8');
      return { ...product, detail_info: contentString };
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number = undefined,
  ) {
    try {
      const product = await this.findOne(id, false);
      const updateValue = (field: string) => {
        if (updateProductDto[field] !== undefined)
          product[field] = updateProductDto[field];
      };

      if (product) {
        if (updateProductDto.title !== undefined) {
          product.title = updateProductDto.title;
        }
        if (updateProductDto.category_level1_id !== undefined) {
          const category1 = new Category();
          category1.id = updateProductDto.category_level1_id;
          product.category_level1 = category1;
        }

        if (updateProductDto.category_level2_id !== undefined) {
          const category2 = new Category();
          category2.id = updateProductDto.category_level2_id;
          product.category_level2 = category2;
        }

        if (updateProductDto.category_level3_id !== undefined) {
          const category3 = new Category();
          category3.id = updateProductDto.category_level3_id;
          product.category_level3 = category3;
        }
        updateValue('construction_law');
        updateValue('size_w');
        updateValue('size_l');
        updateValue('size_t');
        updateValue('view_point');
        updateValue('desc');
        if (updateProductDto.tags) {
          product.tags = [];

          for (const tag of updateProductDto.tags) {
            const tagEntity = new Tag();
            tagEntity.id = tag.id;
            product.tags.push(tagEntity);
          }
        }
        if (updateProductDto.color_code !== undefined) {
          product.color_info = new CommonConstant();
          product.color_info.id = updateProductDto.color_code;
        }

        if (updateProductDto.family_type_code !== undefined) {
          product.family_type_info = new CommonConstant();
          product.family_type_info.id = updateProductDto.family_type_code;
        }
        if (updateProductDto.house_style_code !== undefined) {
          product.house_style_info = new CommonConstant();
          product.house_style_info.id = updateProductDto.house_style_code;
        }
        if (updateProductDto.house_type_code !== undefined) {
          product.house_type_info = new CommonConstant();
          product.house_type_info.id = updateProductDto.house_type_code;
        }
        if (updateProductDto.area_space_code !== undefined) {
          product.area_space_info = new CommonConstant();
          product.area_space_info.id = updateProductDto.area_space_code;
        }

        if (updateProductDto.similarProductIds) {
          product.similarProducts = [];

          for (const smProductId of updateProductDto.similarProductIds) {
            const smProductEntity = new Product();
            smProductEntity.id = smProductId;
            product.similarProducts.push(smProductEntity);
          }
        }

        updateValue('thumbnail_url');

        if (updateProductDto.detail_info) {
          const contentBuffer = Buffer.from(
            updateProductDto.detail_info,
            'utf-8',
          );
          product.detail_info = contentBuffer;
        }

        if (updateProductDto.productImages) {
          if (product.productImages) {
            // Find the images to remove
            const imagesToRemove = product.productImages.filter(
              (existingImage) => {
                return !updateProductDto.productImages.some(
                  (newImage) => newImage.id === existingImage.id,
                );
              },
            );

            // Delete the images that are no longer associated with the entity
            if (imagesToRemove.length) {
              await this.productImageRepository.remove(imagesToRemove);
            }
          }

          product.productImages = [];
          for (const productImage of updateProductDto.productImages) {
            const productImageEntity = new ProductImage();
            if (productImage.id) {
              productImageEntity.id = productImage.id;
            }
            productImageEntity.image_url = productImage.image_url;
            product.productImages.push(productImageEntity);
          }
        }

        if (updateProductDto.productBlogs) {
          // important part for avoiding duplicate key issue
          // if (!product.productBlog) {
          //   product.productBlog = new ProductBlog();
          // }
          product.productBlogs = [];
          for (const productBlog of updateProductDto.productBlogs) {
            const productBlogEntity = new ProductBlog();
            if (productBlog.id) {
              productBlogEntity.id = productBlog.id;
            }
            productBlogEntity.summary = productBlog.summary;
            productBlogEntity.thumb_url = productBlog.thumb_url;
            productBlogEntity.title = productBlog.title;
            productBlogEntity.url = productBlog.url;
            product.productBlogs.push(productBlogEntity);
          }
        }

        if (updateProductDto.productYoutube) {
          if (!product.productYoutube) {
            product.productYoutube = new ProductYoutube();
          }
          if (updateProductDto.productYoutube.id) {
            product.productYoutube.id = updateProductDto.productYoutube.id;
          }
          product.productYoutube.summary =
            updateProductDto.productYoutube.summary;
          product.productYoutube.thumb_url = getYoutubeThumbUrl(
            updateProductDto.productYoutube.url,
          );
          product.productYoutube.title = updateProductDto.productYoutube.title;
          product.productYoutube.url = updateProductDto.productYoutube.url;
        }
        updateValue('selected_icons');
        updateValue('hidden');
        updateValue('recommended');
        updateValue('top_fixed');

        if (userId !== undefined) {
          product.updated_by = userId;
        }
        return await this.productRepository.save(product);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('entity_id = :entityId', { entityId: id })
      .andWhere('type = :type', { type: WishEntityType.Product })
      .execute();
    await this.viewLogService.removeBy(id, ViewLogEntityType.Product);
    return await this.productRepository.delete(id);
  }

  async deleteMultipleRecords(idArrayDto: EntityIdArrayDto): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(idArrayDto.ids)
      .execute();
  }

  async resetThisMonthPopularity(): Promise<void> {
    await this.productPopularityRepository
      .createQueryBuilder()
      .update(ProductPopularity)
      .set({
        prev_month_count: () => 'this_month_count',
        this_month_count: 0,
        prev_month_rank: () => 'this_month_rank',
        this_month_rank: 0,
      })
      .execute();
  }

  async updatePopularPoint(): Promise<void> {
    // Update this_month_rank based on this_month_count ranking
    await this.productPopularityRepository.query(`
      UPDATE product_popularity
      JOIN (
        SELECT id, this_month_count,
              (
                SELECT COUNT(*) + 1
                FROM product_popularity AS pp2
                WHERE pp2.this_month_count > pp1.this_month_count
              ) AS this_month_rank
        FROM product_popularity AS pp1
      ) AS ranked
      ON product_popularity.id = ranked.id
      SET product_popularity.this_month_rank = ranked.this_month_rank;
    `);
    // Get all products
    const products = await this.productRepository.find({
      relations: {
        productPopularity: true,
      },
      select: ['id', 'productPopularity', 'view_point'],
    });

    for (const product of products) {
      // Calculate popularity_point based on your formula
      let popularityPoint = product.view_point;

      if (product.productPopularity) {
        // If a record exists, update it
        popularityPoint =
          popularityPoint +
          (product.productPopularity.this_month_rank
            ? products.length - product.productPopularity.this_month_rank
            : 0);
        popularityPoint =
          popularityPoint +
          (product.productPopularity.prev_month_rank
            ? (products.length - product.productPopularity.prev_month_rank) / 2
            : 0);
        product.productPopularity.popularity_point = popularityPoint;
        await this.productPopularityRepository.save(product.productPopularity);
      } else {
        // If no record exists, create a new one
        const newPopularity = new ProductPopularity();
        newPopularity.product = new Product();
        newPopularity.product.id = product.id;
        newPopularity.popularity_point = popularityPoint;
        await this.productPopularityRepository.save(newPopularity);
      }
    }
  }
  async updateBatchOrder(entityIdArrayDto: EntityIdArrayDto) {
    try {
      let seq = 0;
      for (const id of entityIdArrayDto.ids) {
        seq = seq + 1;
        await this.productRepository.update(id, { seq: seq });
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
