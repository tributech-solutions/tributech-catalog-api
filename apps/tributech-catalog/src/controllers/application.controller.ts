import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('')
export class ApplicationController {
  @Get('/')
  @ApiExcludeEndpoint()
  redirect(@Res() res) {
    return res.redirect('/api');
  }
}
