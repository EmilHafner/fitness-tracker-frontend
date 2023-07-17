export enum Role {
  user = "user",
  admin = "admin",
}

declare module "next-auth" {
  interface User {
    id: number | string;
    firstName: string;
    lastName: string;
    username: string;
    role: Role | string;
  }

  interface Session extends DefaultSession {
    user?: User;
    jwt?: string;
  }
}
