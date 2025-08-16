import { Controller, Get } from '@nestjs/common';
import { ZonesService } from '../services/zones.service';

@Controller('/v1/zones')
export class ZonesController {
  constructor(private readonly zones: ZonesService) {}
  @Get() list() { return this.zones.list(); }
}
