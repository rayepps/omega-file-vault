import { isResponse, Props, Response } from '@exobase/core'
import { tryit } from 'radash'

export const useStandardResponse =
  () =>
  (func: Function) =>
  async (props: Props): Promise<Response> => {
    const [error, result] = (await tryit(func as any)(props)) as [any, Response]
    if (error) {
      console.error(error)
    }
    if (isResponse(error)) {
      return {
        ...error,
        body: error.body.error
          ? error.body
          : {
              result: null,
              error: error.body
            }
      }
    }
    if (isResponse(result)) {
      return {
        ...result,
        body: result.body.result
          ? result.body
          : {
              result: result.body,
              error: null
            }
      }
    }
    return {
      ...props.response,
      status: 200,
      body: {
        error: null,
        result
      }
    }
  }
