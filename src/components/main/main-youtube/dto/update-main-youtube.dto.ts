import { PartialType } from '@nestjs/mapped-types';
import { CreateMainYoutubeDto } from './create-main-youtube.dto';

export class UpdateMainYoutubeDto extends PartialType(CreateMainYoutubeDto) {}
