export type Message = {
  text: string;
  sentBy: string | undefined;
  createdAt: string | undefined;
  userName: string | undefined;
}

export type AIMessage = {
  text: string;
  sentBy: string | undefined;
  createdAt: string | undefined;
  userName: string | undefined;
  image:string;
  roundNum:number;
}

export type Game = {
  gameId: string;
  host: string;
  players: string[];
  antagonistId: string;
  state: string;
}
