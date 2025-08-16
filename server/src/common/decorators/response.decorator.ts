import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiSuccessResponse } from '../response';

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
