import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiSuccessResponse } from '../response';

export const ApiOkSuccessResponse = <T extends Type<any>>(
  description: string,
  model: T,
  isArray: boolean,
) => {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponse, model),
    ApiOkResponse({
      description,
      schema: {
        ...(isArray
          ? {
              allOf: [
                { $ref: getSchemaPath(ApiSuccessResponse) },
                {
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                  },
                },
              ],
            }
          : {
              allOf: [
                { $ref: getSchemaPath(ApiSuccessResponse) },
                {
                  properties: {
                    data: {
                      $ref: getSchemaPath(model),
                    },
                  },
                },
              ],
            }),
      },
    }),
  );
};

export const ApiCreatedSuccessResponse = <T extends Type<any>>(
  description: string,
  model: T,
) => {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponse, model),
    ApiCreatedResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiSuccessResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
