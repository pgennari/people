import * as N from '@nestjs/common';
import { CommandsService } from './services/commands.service';
import { QueriesService } from './services/queries.service';
import { AuthService } from './services/auth.service';
import { CreatePeopleCommand, UpdatePeopleCommand } from './commands';
import { ReadModel } from './models';

@N.Controller()
export class AppController {
  constructor(
    private readonly commandService: CommandsService,
    private readonly queriesService: QueriesService,
    private readonly authService: AuthService,
  ) {}

  @N.Get('healthcheck')
  public healthcheck(): string {
    return 'People are crazy!!';
  }

  @N.Get('people')
  public getAllPeople(
    @N.Query('showDeleted', new N.DefaultValuePipe(false), N.ParseBoolPipe)
    showDeleted: boolean,
    @N.Query('skip', new N.DefaultValuePipe(0), N.ParseIntPipe)
    skip: number,
    @N.Query('limit', new N.DefaultValuePipe(10), N.ParseIntPipe)
    limit: number,
  ): Promise<ReadModel.PeopleView[]> {
    return this.queriesService.fetchAllPeople({ skip, limit, showDeleted });
  }
  @N.Get('people/:id')
  public getPeople(
    @N.Param('id') id: string,
    @N.Query('showDeleted', new N.DefaultValuePipe(false), N.ParseBoolPipe)
    showDeleted: boolean,
  ): Promise<ReadModel.PeopleView> {
    return this.queriesService.fetchOnePerson(id, showDeleted);
  }
  @N.Post('people')
  public createPeople(@N.Body() command: CreatePeopleCommand): Promise<string> {
    const result = this.commandService.createPeople(command);
    return result;
  }

  @N.Patch('people/:id')
  public updatePeople(
    @N.Param('id') id: string,
    @N.Body() command: UpdatePeopleCommand,
  ): Promise<void> {
    return this.commandService.updatePeople(id, command);
  }

  @N.Delete('people/:id')
  public deletePeople(@N.Param('id') id: string): Promise<void> {
    return this.commandService.deletePeople(id);
  }

  @N.Post('auth/login')
  public verifyPeople(
    @N.Body('email') email: string,
    @N.Body('cellphone') cellphone: string,
  ): Promise<void> {
    return this.authService.sendOTP(email, cellphone);
  }

  @N.Post('auth/login/verified')
  public async verify(
    @N.Body('id') id: string,
    @N.Body('otp') otp: string,
  ): Promise<any> {
    await this.authService.verifyOtp(id, otp);
    const jwt = await this.authService.generateJwt(id);
    return { jwt, success: true };
  }

  @N.Post('auth/token/valid')
  public async verifyToken(
    @N.Body('token') token: string,
  ): Promise<any> {
    return await this.authService.verifyToken(token);
  }
}
