import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { OnlineHouse } from '../online-house/entities/online-house.entity';
import { ExpertHouse } from '../expert-house/entities/expert-house.entity';
import { QuestionAndAnswer } from '../question-and-answer/entities/question-and-answer.entity';
import { Order } from '../../shared/constants';
import { PageDto, PageMetaDto } from '../../shared/dtos';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StatisticsService {
  private readonly checkInUseMins = 8;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(VisitLog)
    private visitLogRepository: Repository<VisitLog>,
    @InjectRepository(OnlineHouse)
    private onlineHouseRepository: Repository<OnlineHouse>,
    @InjectRepository(ExpertHouse)
    private expertHouseRepository: Repository<ExpertHouse>,
    @InjectRepository(QuestionAndAnswer)
    private questionAndAnswerRepository: Repository<QuestionAndAnswer>,
  ) {}

  async createOrUpdateVisit(userId: number): Promise<VisitLog> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('사용자 정보가 존재하지 않습니다.');
    }

    const today = new Date();
    const visit = await this.visitLogRepository.findOne({
      where: {
        user,
        timestamp: Between(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
          ),
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
          ),
        ),
      },
    });

    let result: any = {};
    if (visit) {
      visit.timestamp = new Date();
      result = this.visitLogRepository.save(visit);
    } else {
      const newVisit = new VisitLog();
      newVisit.timestamp = new Date();
      newVisit.user = user;
      result = this.visitLogRepository.save(newVisit);
    }
    delete result.user;
    return result;
  }

  private async getTodayVisitCount(): Promise<number> {
    const today = new Date();
    const count = await this.visitLogRepository.count({
      where: {
        timestamp: Between(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
          ),
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
          ),
        ),
      },
    });

    return count;
  }

  private async getTodayRegisterCount(): Promise<number> {
    const today = new Date();
    const count = await this.userRepository.count({
      where: {
        created_at: Between(
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0,
          ),
          new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
          ),
        ),
      },
    });

    return count;
  }

  private async getVisitCountsLast7Days(): Promise<number[]> {
    const end = new Date();
    let start = new Date();
    start.setDate(end.getDate() - 6);
    start = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0,
    );

    const visits = await this.visitLogRepository.find({
      where: {
        timestamp: Between(start, end),
      },
    });

    const visitCounts = new Array(7).fill(0);
    visits.forEach((visit) => {
      const dayDifference = Math.floor(
        (end.getTime() - visit.timestamp.getTime()) / (1000 * 60 * 60 * 24),
      );
      visitCounts[dayDifference] += 1;
    });

    return visitCounts;
  }

  private async getUserCountInUse(): Promise<number> {
    const checkTime = new Date();
    checkTime.setMinutes(checkTime.getMinutes() - this.checkInUseMins);

    const count = await this.visitLogRepository
      .createQueryBuilder('visit')
      .where('visit.timestamp >= :checkTime', { checkTime })
      .getCount();

    return count;
  }

  private async getOnlinePendingCount(): Promise<number> {
    const status = 0;

    const count = await this.onlineHouseRepository
      .createQueryBuilder('onine_houses')
      .where('onine_houses.status = :status', { status })
      .getCount();

    return count;
  }

  private async getExpertPendingCount(): Promise<number> {
    const status = 0;

    const count = await this.expertHouseRepository
      .createQueryBuilder('expert_houses')
      .where('expert_houses.status = :status', { status })
      .getCount();

    return count;
  }

  private async getAnswerPendingCount(): Promise<number> {
    const status = 0;

    const count = await this.questionAndAnswerRepository
      .createQueryBuilder('question_answers')
      .where('question_answers.status = :status', { status })
      .getCount();

    return count;
  }

  private async getLastQuestions(): Promise<Array<QuestionAndAnswer>> {
    try {
      const orderBy = 'updated_at';
      let query = this.questionAndAnswerRepository
        .createQueryBuilder('question_and_answers')
        .leftJoinAndSelect('question_and_answers.requester', 'requester')
        .leftJoinAndSelect(
          'question_and_answers.question_type_info',
          'question_type_info',
        )
        .select([
          'question_and_answers.id',
          'question_and_answers.question_title',
          'question_and_answers.question_content',
          'question_and_answers.updated_at',
          'question_type_info',
          'question_and_answers.status',
          'requester.id',
          'requester.name',
        ]);

      query = query
        .skip(0)
        .take(4)
        .orderBy(`question_and_answers.${orderBy}`, Order.DESC);

      const entities = await query.getMany();

      return entities;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDashboard(): Promise<any> {
    try {
      const userCountInUse = await this.getUserCountInUse();
      const weekVisitData = await this.getVisitCountsLast7Days();
      const todayVisitCount = await this.getTodayVisitCount();
      const todayRegisterCount = await this.getTodayRegisterCount();
      const onlinePendingCount = await this.getOnlinePendingCount();
      const expertPendingCount = await this.getExpertPendingCount();
      const answerPendingCount = await this.getAnswerPendingCount();
      const questionList = await this.getLastQuestions();

      const response = {
        today_visit_count: todayVisitCount,
        today_register_count: todayRegisterCount,
        current_user_count: userCountInUse,
        online_pending_count: onlinePendingCount,
        expert_pending_count: expertPendingCount,
        answer_pending_count: answerPendingCount,
        week_visit_data: weekVisitData ?? [],
        question_list: questionList,
      };

      return response;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
