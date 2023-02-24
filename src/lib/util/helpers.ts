import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { TRPCError } from "@trpc/server"

interface Props<T> {
    action: () => Promise<T>,
    onUniqueConstraintError?: (error: PrismaClientKnownRequestError) => TRPCError,
    onPrismaClientKnownRequestError?: (error: PrismaClientKnownRequestError) => TRPCError,
    onUnknownError?: (error: unknown) => TRPCError,
}

// For some reason error instanceof PrismaClientKnownRequestError doesn't work anymore (I hate you JavaScript)
export function isPrismaError(error: unknown): error is PrismaClientKnownRequestError {
    return (error as PrismaClientKnownRequestError).code !== undefined && (error as PrismaClientKnownRequestError).clientVersion !== undefined
}

export async function prismaOperation<T>(props: Props<T>) {
    try {
        return await props.action()
    } catch (error) {
        // If is not a prisma error
        if (!isPrismaError(error)) {
            // Try custom error
            if (props.onUnknownError) throw props.onUnknownError(error)

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal Error, please try again',
            })
        }

        // Unique constraint error
        if (error.code = 'P2002') {
            if (props.onUniqueConstraintError) throw props.onUniqueConstraintError(error)
            throw new TRPCError({
                code: 'CONFLICT',
                cause: 'unique_constraint_failed',
                message: 'Internal Error, please try again',
            })
        } else {
            // Other prisma error
            if (props.onPrismaClientKnownRequestError) throw props.onPrismaClientKnownRequestError(error)
        }

        // Any error
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Error, please try again',
        })
    }
}