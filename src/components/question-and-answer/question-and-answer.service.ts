import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionAndAnswerDto } from './dto/create-question-and-answer.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { SearchQuestionAndAnswerDto } from './dto/search-question-and-answer.dto';
import { QuestionAndAnswer } from './entities/question-and-answer.entity';
import { User } from '../users/entities/user.entity';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { QuestionImage } from './entities/question-image.entity';
import { AnswerImage } from './entities/answer-image.entity';
import { CommonConstant } from '../common-constant/entities/common-constant.entity';
import { GeneralProcessStatus, Order } from '../../shared/constants';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class QuestionAndAnswerService {
  constructor(
    @InjectRepository(QuestionAndAnswer)
    private questionAndAnswerRepository: Repository<QuestionAndAnswer>,
  ) {}
  async create(
    createQuestionAndAnswerDto: CreateQuestionAndAnswerDto,
    userId: number = undefined,
  ) {
    try {
      const newQuestionAndAnswer = new QuestionAndAnswer();
      newQuestionAndAnswer.question_title =
        createQuestionAndAnswerDto.question_title;

      if (createQuestionAndAnswerDto.question_type_code !== undefined) {
        newQuestionAndAnswer.question_type_info = new CommonConstant();
        newQuestionAndAnswer.question_type_info.id =
          createQuestionAndAnswerDto.question_type_code;
      }
      newQuestionAndAnswer.question_content =
        createQuestionAndAnswerDto.question_content;

      newQuestionAndAnswer.questionImages = [];
      for (const questionImages of createQuestionAndAnswerDto.questionImages) {
        const questionImagesEntity = new QuestionImage();
        questionImagesEntity.image_url = questionImages.image_url;
        newQuestionAndAnswer.questionImages.push(questionImagesEntity);
      }

      if (userId !== undefined) {
        newQuestionAndAnswer.requester = new User();
        newQuestionAndAnswer.requester.id = userId;
        newQuestionAndAnswer.requested_at = new Date();

        newQuestionAndAnswer.question_updated_at = new Date();
      }

      return await this.questionAndAnswerRepository.save(newQuestionAndAnswer);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getItemList(
    pageOptionsDto: SearchQuestionAndAnswerDto,
  ): Promise<PageDto<QuestionAndAnswer>> {
    try {
      const orderBy = pageOptionsDto.sortBy || 'id';
      let query = this.questionAndAnswerRepository
        .createQueryBuilder('question_and_answers')
        .leftJoinAndSelect('question_and_answers.requester', 'requester')
        .leftJoinAndSelect(
          'question_and_answers.questionImages',
          'questionImages',
        )
        .leftJoinAndSelect(
          'question_and_answers.question_type_info',
          'question_type_info',
        )
        .select([
          'question_and_answers.id',
          'question_and_answers.question_title',
          'question_and_answers.question_content',
          'questionImages',
          'question_type_info',
          'question_and_answers.status',
          'question_and_answers.updated_at',
          'question_and_answers.requested_at',
          'question_and_answers.rejected_at',
          'question_and_answers.completed_at',
          'requester.id',
          'requester.name',
          'requester.email',
          'requester.phone',
          'requester.account_type',
        ]);
      if (pageOptionsDto.status_list && pageOptionsDto.status_list.length) {
        query = query.andWhere(
          `question_and_answers.status IN (:...status_list)`,
          {
            status_list: pageOptionsDto.status_list,
          },
        );
      }
      if (pageOptionsDto.q && pageOptionsDto.q_type) {
        query = query.andWhere(
          `LOWER(${pageOptionsDto.q_type}) LIKE LOWER(:pattern)`,
          {
            pattern: `%${pageOptionsDto.q}%`,
          },
        );
      }
      if (pageOptionsDto.requester_id !== undefined) {
        query = query.andWhere(`requester.id = :requester_id`, {
          requester_id: pageOptionsDto.requester_id,
        });
      }
      if (
        pageOptionsDto.question_type_list &&
        pageOptionsDto.question_type_list.length
      ) {
        query = query.andWhere(
          `question_type_info.id IN (:...question_type_list)`,
          {
            question_type_list: pageOptionsDto.question_type_list,
          },
        );
      }

      const queryDateType = pageOptionsDto.date_type || 'requested_at';
      if (pageOptionsDto.from && pageOptionsDto.to) {
        query = query.andWhere(
          `question_and_answers.${queryDateType} BETWEEN :from AND :to`,
          {
            from: new Date(pageOptionsDto.from),
            to: new Date(pageOptionsDto.to),
          },
        );
      } else if (pageOptionsDto.from) {
        query = query.andWhere(
          `question_and_answers.${queryDateType} >= :from`,
          {
            from: new Date(pageOptionsDto.from),
          },
        );
      } else if (pageOptionsDto.to) {
        query = query.andWhere(`question_and_answers.${queryDateType} <= :to`, {
          to: new Date(pageOptionsDto.to),
        });
      }

      query = query
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .orderBy(`question_and_answers.${orderBy}`, Order.DESC);

      const [entities, totalCount] = await query.getManyAndCount();
      let allCount = undefined;
      if (pageOptionsDto.needAllCount) {
        allCount = await this.questionAndAnswerRepository.count();
      }
      const pageMetaDto = new PageMetaDto({
        totalCount,
        pageOptionsDto,
        allCount,
      });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<any> {
    const questionAndAnswer = await this.questionAndAnswerRepository.findOne({
      where: { id: id },
      relations: {
        questionImages: true,
        answerImages: true,
        question_type_info: true,
        requester: true,
        statusAdmin: true,
        answerUpdatedUser: true,
        questionUpdatedUser: true,
      },
    });
    return questionAndAnswer;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    userId: number = undefined,
  ) {
    try {
      const questionAndAnswer = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateQuestionDto[field] !== undefined)
          questionAndAnswer[field] = updateQuestionDto[field];
      };

      if (questionAndAnswer) {
        updateValue('question_title');
        updateValue('question_content');

        if (updateQuestionDto.questionImages) {
          questionAndAnswer.questionImages = [];
          for (const questionImage of updateQuestionDto.questionImages) {
            const questionImageEntity = new QuestionImage();
            if (questionImage.id) {
              questionImageEntity.id = questionImage.id;
            }
            questionImageEntity.image_url = questionImage.image_url;
            questionAndAnswer.questionImages.push(questionImageEntity);
          }
        }

        if (updateQuestionDto.question_type_code !== undefined) {
          questionAndAnswer.question_type_info = new CommonConstant();
          questionAndAnswer.question_type_info.id =
            updateQuestionDto.question_type_code;
        }

        if (userId !== undefined) {
          questionAndAnswer.updated_by = userId;
          questionAndAnswer.questionUpdatedUser = new User();
          questionAndAnswer.questionUpdatedUser.id = userId;
          questionAndAnswer.question_updated_at = new Date();
        }
        return await this.questionAndAnswerRepository.save(questionAndAnswer);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async updateAnswer(
    id: number,
    updateAnswerDto: UpdateAnswerDto,
    userId: number = undefined,
  ) {
    try {
      const questionAndAnswer = await this.findOne(id);
      const updateValue = (field: string) => {
        if (updateAnswerDto[field] !== undefined)
          questionAndAnswer[field] = updateAnswerDto[field];
      };

      if (questionAndAnswer) {
        questionAndAnswer.answer_updated_at = new Date();
        questionAndAnswer.answerUpdatedUser = new Admin();
        questionAndAnswer.answerUpdatedUser.id = userId;
        if (!questionAndAnswer.answer_title) {
          // create
          questionAndAnswer.answer_created_at = new Date();
          questionAndAnswer.statusAdmin = new Admin();
          questionAndAnswer.statusAdmin.id = userId;
        }
        updateValue('answer_title');
        updateValue('answer_content');

        if (updateAnswerDto.answerImages) {
          questionAndAnswer.answerImages = [];
          for (const answerImage of updateAnswerDto.answerImages) {
            const answerImageEntity = new AnswerImage();
            if (answerImage.id) {
              answerImageEntity.id = answerImage.id;
            }
            answerImageEntity.image_url = answerImage.image_url;
            questionAndAnswer.answerImages.push(answerImageEntity);
          }
        }
        if (updateAnswerDto.status !== undefined) {
          questionAndAnswer.status = updateAnswerDto.status;
          if (updateAnswerDto.status === GeneralProcessStatus.APPROVED) {
            questionAndAnswer.completed_at = new Date();
          } else if (updateAnswerDto.status === GeneralProcessStatus.REJECTED) {
            questionAndAnswer.rejected_at = new Date();
          }
        }
        return await this.questionAndAnswerRepository.save(questionAndAnswer);
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async remove(id: number) {
    return await this.questionAndAnswerRepository.delete(id);
  }

  async removeAnswer(id: number) {
    const questionAndAnswer = await this.findOne(id);
    if (questionAndAnswer) {
      questionAndAnswer.answer_content = null;
      questionAndAnswer.answer_title = null;
      questionAndAnswer.status = GeneralProcessStatus.WAITING_APPROVAL;
      questionAndAnswer.statusAdmin = null;
      questionAndAnswer.answerUpdatedUser = null;
      questionAndAnswer.answer_created_at = null;
      questionAndAnswer.answer_updated_at = null;
      questionAndAnswer.rejected_at = null;
      questionAndAnswer.completed_at = null;
      questionAndAnswer.answerImages = [];
      return await this.questionAndAnswerRepository.save(questionAndAnswer);
    }
  }
}
