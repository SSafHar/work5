export class Plans {
  public id: string;
  public name: string;
  public description: string;
  public amount: number;
  public period: number;
  public features: string[];
}

export class CardDetails {
  public cardNumber: string;
  public cardCvc: string;
  public expMonth: string;
  public expYear: string;
}
