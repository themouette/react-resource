import { stringifyQuery, combineQueries } from './queryString';

describe('#stringifyQuery()', () => {
    it('should stringify empty string', () => {
        const query = '';
        const ret = stringifyQuery(query);

        expect(ret).toEqual('');
    });

    it('should stringify null', () => {
        const query = null;
        const ret = stringifyQuery(query);

        expect(ret).toEqual('');
    });

    it('should stringify undefined', () => {
        const query = undefined;
        const ret = stringifyQuery(query);

        expect(ret).toEqual('');
    });

    it('should stringify qs string', () => {
        const query = 'hello=world';
        const ret = stringifyQuery(query);

        expect(ret).toEqual('hello=world');
    });

    it('should stringify object', () => {
        const query = {
            hello: 'world',
            whats: 'up'
        };
        const ret = stringifyQuery(query);

        expect(ret).toEqual('hello=world&whats=up');
    });

    it('should stringify objects empty values', () => {
        const query = {
            hello: '',
            world: null,
            whats: undefined
        };
        const ret = stringifyQuery(query);

        expect(ret).toEqual('hello&world&whats');
    });

    it('should stringify objects non string values', () => {
        const query = {
            hello: 0,
            world: 1,
            whats: true,
            up: false
        };
        const ret = stringifyQuery(query);

        expect(ret).toEqual('hello=0&world=1&whats=true&up=false');
    });

    it('should stringify nested objects', () => {
        const query = {
            hello: {
                world: {
                    whats: 'up'
                }
            }
        };
        const ret = stringifyQuery(query);

        expect(ret).toEqual('hello.world.whats=up');
    });

    it('should stringify arrays', () => {
        const query = {
            hello: ['world', 'whats', 'up']
        };
        const ret = stringifyQuery(query);

        expect(ret).toEqual('hello.0=world&hello.1=whats&hello.2=up');
    });
});

describe('#combineQueries()', () => {
    it('should combine string queries', () => {
        const combo = combineQueries('hello=world&whats=up', 'same=old');

        expect(combo).toEqual('hello=world&whats=up&same=old');
    });

    it('should combine objects', () => {
        const combo = combineQueries(
            { hello: { whats: 'up' } },
            { same: ['old'] }
        );

        expect(combo).toEqual('hello.whats=up&same.0=old');
    });

    it('should combine strings, objects and override', () => {
        const combo = combineQueries(
            { hello: { whats: 'up' }, same: ['old'] },
            'same.0=new&same.1=old'
        );

        expect(combo).toEqual('hello.whats=up&same.0=new&same.1=old');
    });

    it('should combine empty values', () => {
        const combo = combineQueries(
            { hello: { whats: 'up' } },
            null,
            undefined,
            '',
            'same.0=old'
        );

        expect(combo).toEqual('hello.whats=up&same.0=old');
    });
});
