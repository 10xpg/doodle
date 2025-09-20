import { SetMetadata } from '@nestjs/common';

export const AllowAnonymousAccess = () => {
  return SetMetadata('isPublic', true);
};

// NOTE: decorator returned from factory takes some params
// @Param1 : Target <any> - the type of entity being docorated on
// @Param2 : propertyKey <string>
// @Param3 : propertyDescriptor <PropertyDescriptor>
//
// HACK: Used by decorating the decoratorFactorys name on the class,method,prop or param
// The returned decorator function is executed before the entity being decorated
//
/*
export const TestDecoratorFactory = () => {
  return (target, propertyKey: string, propertyDesc: PropertyDescriptor) => {
    console.log({
      msg: 'The allow anon decorator is called!',
      target,
      propertyKey,
      propertyDesc,
    });
  };
};
*/
