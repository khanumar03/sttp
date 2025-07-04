export interface Message {
  id: number;
  text: string;
  signature: string;
  status: "available" | "pending" | "added";
}

export interface Block {
  signature: string;
  eventName: string;
  _messages: Message[];
  public_key: string[];
  isFinalized: boolean;
  isInvalid?: boolean;
}
