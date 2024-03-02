import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BusinessLocalAuthGuard extends AuthGuard('business-local') {}
