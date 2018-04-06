export class User {
  public id: string;
  public name: string;
  public email: string;
  public userName: string;
  public image: any;
  public created: number;
  public updated: number;
  public lastLogin: number;
  public free_minutes: number;
  public is_premium: boolean;
  public enabled: boolean;
  public roles: string[];
  public subscription_started: number;
  public subscription: Subscription;
}

export class Subscription {
  public id: string;
  public name: string;
  public description: string;
  public amount: number;
  public period: number;
  public features: string[];
}

export class ContactModel {
  public name: string = '';
  public email: string = '';
  public message: string = '';
}
