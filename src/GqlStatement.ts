import { Argument, Field, OperationName, OperationType } from "./types";

class GqlStatement {
    private operationType: OperationType;
    private operationName: OperationName;
    private arguments: Argument[];
    private fields: Field[];

    constructor(operationType: OperationType, operationName: OperationName) {
        this.operationType = operationType;
        this.operationName = operationName;
        this.arguments = [];
        this.fields = [];
    }

    private stringifyField(field: Field): string | undefined {
        if (typeof field === 'string') {
            if (field !== '') {
                return field;
            }
        } else if (typeof field === 'object') {
            if (field.name !== '') {
                const toAdd = field.fields?.map((fld: Field) => this.stringifyField(fld)).filter((fldString: string | undefined) => fldString !== undefined);
                return `${field.name}${
                   toAdd ? `{${toAdd}}` : ''
                }`;
            }
        }
        return;
    }

    addArgument(arg: Argument) {
        this.arguments.push(arg);
        return this;
    }

    addArguments(args: Argument[]) {
        args.forEach(arg => this.addArgument(arg));
        return this;
    }

    addField(field: Field) {
        const toAdd = this.stringifyField(field);
        if (toAdd) {
            this.fields.push(toAdd);
        }
        return this;
    }

    addFields(fields: Field[]) {
        fields.forEach(field => this.addField(field));
        return this;
    }

    toString() {
        let str = this.operationType === 'mutation' ? `${this.operationType}{` : '';
        
        // add operation name
        str += this.operationName;

        // opening brackets if any arguments
        if (this.arguments.length) {
            str += '(';
        }

        // add arguments
        str += this.arguments
            // map object into "name:value"    
            .map((arg: Argument) => `${arg.name}:${
                typeof arg.value === 'string' ? `"${arg.value}"` : arg.value
            }`)
            // join the string array into comma separated string
            .join();

        // closing brackets if any arguments
        if (this.arguments.length) {
            str += ')';
        }
        
        // open fields section
        if (this.fields.length) {
            str += '{';
        }

        // add fields
        str += this.fields.join();

        // closing fields section
        if (this.fields.length) {
            str += '}';
        }

        // closing mutation definition if applicable
        if (this.operationType === 'mutation')
        str += '}';
        
        return `{query:${str}}`;
    }
}

export default GqlStatement;
