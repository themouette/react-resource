import { QueryString, QueryStringParam } from './types';

const stringifyQueryRecurse = (
    query: QueryString | QueryStringParam,
    prefix: string = ''
): string => {
    if (typeof query === 'undefined' || query === null || query === '') {
        return `${prefix}`;
    }
    if (typeof query === 'boolean') {
        const valueStr = query ? 'true' : 'false';
        return prefix.length > 0 ? `${prefix}=${valueStr}` : `${valueStr}`;
    }
    if (typeof query === 'string') {
        return prefix.length > 0 ? `${prefix}=${query}` : `${query}`;
    }
    if (typeof query === 'number') {
        return prefix.length > 0 ? `${prefix}=${query}` : `${query}`;
    }

    if (Array.isArray(query)) {
        return query
            .map((item, index) => {
                return stringifyQueryRecurse(
                    item,
                    prefix.length > 0 ? `${prefix}.${index}` : `${index}`
                );
            })
            .join('&');
    }

    // this is an object
    return Object.keys(query)
        .map(key =>
            stringifyQueryRecurse(
                query[key],
                prefix.length > 0 ? `${prefix}.${key}` : `${key}`
            )
        )
        .join('&');
};
export const stringifyQuery = (query: QueryString | null | undefined) =>
    stringifyQueryRecurse(query, '');

export const combineQueries = (
    ...queries: Array<QueryString | null | undefined>
): string => {
    const queriesAsString = queries.filter(Boolean).map(stringifyQuery);
    const queriesAsKeyValues = queriesAsString.map(query => {
        return query.split(/&/g).reduce(
            (acc, part) => {
                const [key, value = ''] = part.split('=');
                return {
                    ...acc,
                    [key]: value
                };
            },
            {} as { [key: string]: string }
        );
    });

    const combinedQueries = queriesAsKeyValues.reduce(
        (acc, query) => ({ ...acc, ...query }),
        {} as { [key: string]: string }
    );

    return stringifyQuery(combinedQueries);
};

export const combinePathAndQuery = (
    path: string = '',
    query: string = ''
): string => {
    const [pathRoot = '', pathQs = ''] = path.split('?');
    const pathSeparator = pathQs.length || query.length ? '?' : '';
    const queryStringSeparator = pathQs.length && query.length ? '&' : '';

    return `${pathRoot}${pathSeparator}${pathQs}${queryStringSeparator}${query}`;
};

export const combinePath = (
    ...parts: Array<string | null | undefined>
): string =>
    parts.reduce((acc: string, p) => {
        if (!p) {
            return acc;
        }
        let ret = acc;

        if (acc.endsWith('/')) {
            ret = acc.substring(0, acc.length - 1);
        }
        if (p.startsWith('/')) {
            return `${ret}${p}`;
        }

        return `${ret}/${p}`;
    }, '');
