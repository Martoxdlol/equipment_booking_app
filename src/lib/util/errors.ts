import { TRPCClientError } from "@trpc/client"
import type { TRPCError } from "@trpc/server";

interface ErrorDataType {
    code: TRPCError['code'];
    cause: string;
}

export interface ApiError {
    readonly code: TRPCError['code'];
    readonly cause: string;
    readonly message: string;
}

export function analyzeApiError(error: unknown) {
    if (error instanceof TRPCClientError && isErrorDataType(error.data)) {
        return {
            isApiError: true,
            data: {
                code: error.data.code,
                cause: error.data.cause,
                message: error.message,
            }
        } as const
    }
    return {
        isApiError: false,
        data: null,
    } as const
}

export function isErrorDataType(error: unknown): error is ErrorDataType {
    return (error as ErrorDataType).code !== undefined
}


export interface ApiOperation {
    action: () => Promise<unknown>,
    onApiError: (error: ApiError) => void,
}

export async function apiOperation(opts: ApiOperation) {
    try {
        return await opts.action()
    } catch (error) {
        const analysis = analyzeApiError(error)
        if(analysis.isApiError) {
            return opts.onApiError(analysis.data)
        }
    }
}