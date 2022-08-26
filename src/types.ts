export type OperationType = 'query' | 'mutation';

export type OperationName = string;

export type Argument = {
    name: string;
    value: any;
};

type FieldObject = { name: string, fields?: Field[] }

export type Field = string | FieldObject;
