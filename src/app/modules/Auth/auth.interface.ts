import { AccountStatus } from "@prisma/client";

export type TChangeStatus = {
    email?: string;
    status: AccountStatus
}