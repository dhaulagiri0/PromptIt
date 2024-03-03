export type Message = {
  text: string;
  user: string | undefined;
  createdAt: string | undefined;
}

export type Game = {
  gameId: string;
  host: string;
  players: string[];
  antagonistId: string;
  state: string;
}
