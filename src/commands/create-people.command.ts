export class CreatePeopleCommand {
  public readonly name: string;
  public readonly email: string;
  public readonly phoneNumber: string;
  public readonly socialName?: string;
  public readonly birthDate?: Date;
  public readonly cpf?: string;
}