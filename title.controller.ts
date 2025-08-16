import { Controller, Get, Param } from '@nestjs/common';
import { TitleService } from '../services/title.service';

@Controller('/v1/cashtag')
export class TitleController {
  constructor(private readonly titles: TitleService) {}

  @Get(':title_id')
  get(@Param('title_id') title_id: string) { return this.titles.getSnapshot(title_id); }

  @Get()
  anchor() { return this.titles.getAnchorStatus(); }
}
