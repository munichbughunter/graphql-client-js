import GqlStatement from '../src/GqlStatement';

describe('GqlStatement', () => {
    it('plain statement', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        expect(statement.toString()).toBe('{query:getSomething}');
    });

    it('statement with arguments', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        statement.addArguments([
            { name: 'arg1', value: 1},
            { name: 'arg2', value: 'test' }
        ]);
        expect(statement.toString()).toBe('{query:getSomething(arg1:1,arg2:"test")}');
    });

    it('statement with fields', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        statement.addFields(['field1', 'field2']);
        expect(statement.toString()).toBe('{query:getSomething{field1,field2}}');
    });

    it('statement with fields and sub fields', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        statement.addFields([
            'field1',
            {name: 'field2', fields: [
                'sub1',
                { name: 'sub2', fields: [
                    'sub2.1',
                ]},
            ]},
        ]);
        expect(statement.toString()).toBe('{query:getSomething{field1,field2{sub1,sub2{sub2.1}}}}');
    });

    it('statement with invalid field - type string', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        statement.addField('');
        expect(statement.toString()).toBe('{query:getSomething}');
    });

    it('statement with invalid field - type object', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        statement.addField({ name: '' });
        expect(statement.toString()).toBe('{query:getSomething}');
    });

    it('statement with invalid field - type object, 2nd level', async () => {
        const statement = new GqlStatement('query', 'getSomething');
        statement.addField({ name: '', fields: [
            '',
            { name: '' }
        ] });
        expect(statement.toString()).toBe('{query:getSomething}');
    });

    it('mutation stamement with arguments an fields', async () => {
        const statement = new GqlStatement('mutation', 'getSomething');
        statement.addArguments([
            { name: 'arg1', value: 1},
            { name: 'arg2', value: 'test' }
        ])
        statement.addFields(['field1', 'field2']);
        expect(statement.toString()).toBe('{query:mutation{getSomething(arg1:1,arg2:"test"){field1,field2}}}');
    });
});