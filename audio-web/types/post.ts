import type { User } from "./user"

export type Post = {
  id: string,
  title: string,
  description: string | undefined,
  user: User
}
