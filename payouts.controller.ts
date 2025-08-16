import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PayoutsService } from '../services/payouts.service';

@Controller('/v1/payouts')
export class PayoutsController {
  constructor(private readonly payouts: PayoutsService) {}

  @Post('onboarding')
  async onboarding(@Body() body: any) { return this.payouts.createOnboardingLink(body.user_id || 'demo-user', body.email || 'demo@cashere.test'); }

  @Get('account/:user_id')
  async status(@Param('user_id') user_id: string) { return this.payouts.getAccountStatus(user_id); }
}
