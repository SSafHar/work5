export class UserLoginModel {
  public login: string;
  public password: string;
  public remember: number;
}

export class UserSignupModel {
  public firstName: string;
  public lastName: string;
  public name: string;
  public email: string;
  public username: string;
  public password: string;
  public confirm_password: string;
  public is_registration?: number = 1;
}
export class ChangePasswordModel {
  public token: string;
  public current_password: string;
  public new_password: string;
  public confirm_password: string;
}
export class ResetPasswordModel {
  public token: string;
  public password: string;
  public confirm_password: string;
}
