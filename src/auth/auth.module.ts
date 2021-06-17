import { HttpModule, Module } from '@nestjs/common';
import { AuthenticationGuard } from './auth.guard';
import { AuthenticationService } from './auth.service';

@Module({
  imports: [HttpModule],
  providers: [AuthenticationGuard, AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
