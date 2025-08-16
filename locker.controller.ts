import { Body, Controller, Post } from '@nestjs/common';
import { LockerService } from '../services/locker.service';

@Controller('/v1/locker')
export class LockerController {
  constructor(private readonly locker: LockerService) {}

  @Post('reserve')
  reserve(@Body() body: any) {
    const res = this.locker.reserve(body.order_id, body.zone_id);
    this.locker.open(res.reservation_id, res.token);
    return res;
  }

  @Post('open')
  open(@Body() body: any) { return this.locker.open(body.reservation_id, body.token); }
}
