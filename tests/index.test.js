import {
    removeCarriageReturn,
    removeHTMLComments,
    reduceNewlines,
    convertMentionsToLinks,
    removeGithubReferenceLinks,
    reduceHeadings,
    convertLinksToMarkdown,
    limitString,
    formatDescription
} from '../index.js';
import { jest } from '@jest/globals';

// ESM-compatible mock for @actions/core
import * as core from '@actions/core';
jest.unstable_mockModule('@actions/core', () => ({
    getBooleanInput: (name) => false,
    getInput: (name) => '',
    setFailed: jest.fn(),
    info: jest.fn(),
    warning: jest.fn()
}));

describe('index.js utility functions', () => {
    test('removeCarriageReturn removes \r', () => {
        expect(removeCarriageReturn('foo\rbar\r\n')).toBe('foobar\n');
    });

    test('removeHTMLComments removes HTML comments', () => {
        expect(removeHTMLComments('foo<!-- comment -->bar')).toBe('foobar');
        expect(removeHTMLComments('foo<!-- multi\nline -->bar')).toBe('foobar');
    });

    test('reduceNewlines reduces multiple newlines', () => {
        expect(reduceNewlines('a\n\n\n\nb')).toBe('a\n\nb');
        expect(reduceNewlines('a\n\nb')).toBe('a\n\nb');
    });

    test('convertMentionsToLinks converts @user to markdown link', () => {
        expect(convertMentionsToLinks('Hello @octocat!')).toBe('Hello [@octocat](https://github.com/octocat)!');
        expect(convertMentionsToLinks('No mention here')).toBe('No mention here');
    });

    test('removeGithubReferenceLinks removes PR/commit/issue links', () => {
        const input = '[PR](https://github.com/owner/repo/pull/1) [Commit](https://github.com/owner/repo/commit/abc123) [Issue](https://github.com/owner/repo/issues/2)';
        expect(removeGithubReferenceLinks(input)).toBe('  ');
    });

    test('removeGithubReferenceLinks trims extra whitespace', () => {
        const input = '[PR](https://github.com/owner/repo/pull/1) foo [Commit](https://github.com/owner/repo/commit/abc123) bar [Issue](https://github.com/owner/repo/issues/2)';
        expect(removeGithubReferenceLinks(input)).toBe(' foo  bar ');
    });

    test('removeGithubReferenceLinks with no links returns original', () => {
        const input = 'No links here!';
        expect(removeGithubReferenceLinks(input)).toBe('No links here!');
    });

    test('convertMentionsToLinks does not convert invalid usernames', () => {
        expect(convertMentionsToLinks('Hello @-invalid!')).toBe('Hello @-invalid!');
        expect(convertMentionsToLinks('Hello @user--name!')).toBe('Hello @user--name!');
    });

    test('reduceNewlines keeps max 2 newlines', () => {
        expect(reduceNewlines('a\n\n\n\n\n\nb')).toBe('a\n\nb');
    });

    test('reduceHeadings reduces headings', () => {
        expect(reduceHeadings('### Heading3')).toBe('**__Heading3__**');
        expect(reduceHeadings('## Heading2')).toBe('**Heading2**');
    });

    test('convertLinksToMarkdown converts PR/issue/changelog links', () => {
        const pr = 'https://github.com/owner/repo/pull/1';
        const issue = 'https://github.com/owner/repo/issues/2';
        const changelog = 'https://github.com/owner/repo/compare/v1.0.0...v1.1.0';
        expect(convertLinksToMarkdown(pr)).toBe('[PR #1](https://github.com/owner/repo/pull/1)');
        expect(convertLinksToMarkdown(issue)).toBe('[Issue #2](https://github.com/owner/repo/issues/2)');
        expect(convertLinksToMarkdown(changelog)).toBe('[v1.0.0...v1.1.0](https://github.com/owner/repo/compare/v1.0.0...v1.1.0)');
    });

    test('convertLinksToMarkdown ignores existing markdown links', () => {
        const input = '[already](https://github.com/owner/repo/pull/1) and https://github.com/owner/repo/pull/2';
        expect(convertLinksToMarkdown(input)).toBe('[already](https://github.com/owner/repo/pull/1) and [PR #2](https://github.com/owner/repo/pull/2)');
    });

    describe('limitString', () => {
        test('returns string unchanged if under maxLength', () => {
            expect(limitString('short', 10)).toBe('short');
        });
        test('truncates and adds ellipsis if over maxLength', () => {
            expect(limitString('1234567890', 5)).toBe('…');
        });
        test('truncates and adds markdown link if url provided', () => {
            expect(limitString('abcdef', 5, 'http://x')).toBe('([…](http://x))');
        });
        test('clips at newline if clipAtLine is true', () => {
            expect(limitString('abc\ndef', 5, undefined, true)).toMatch(/\n…$/);
        });

        // Edge cases for empty, null, and undefined input
        test('removeCarriageReturn handles empty, null, undefined', () => {
            expect(removeCarriageReturn('')).toBe('');
            expect(() => removeCarriageReturn(null)).toThrow();
            expect(() => removeCarriageReturn(undefined)).toThrow();
        });

        test('removeHTMLComments handles empty, null, undefined', () => {
            expect(removeHTMLComments('')).toBe('');
            expect(() => removeHTMLComments(null)).toThrow();
            expect(() => removeHTMLComments(undefined)).toThrow();
        });

        test('reduceNewlines handles empty, null, undefined', () => {
            expect(reduceNewlines('')).toBe('');
            expect(() => reduceNewlines(null)).toThrow();
            expect(() => reduceNewlines(undefined)).toThrow();
        });

        test('convertMentionsToLinks handles empty, null, undefined', () => {
            expect(convertMentionsToLinks('')).toBe('');
            expect(() => convertMentionsToLinks(null)).toThrow();
            expect(() => convertMentionsToLinks(undefined)).toThrow();
        });

        test('removeGithubReferenceLinks handles empty, null, undefined', () => {
            expect(removeGithubReferenceLinks('')).toBe('');
            expect(() => removeGithubReferenceLinks(null)).toThrow();
            expect(() => removeGithubReferenceLinks(undefined)).toThrow();
        });

        test('reduceHeadings handles empty, null, undefined', () => {
            expect(reduceHeadings('')).toBe('');
            expect(() => reduceHeadings(null)).toThrow();
            expect(() => reduceHeadings(undefined)).toThrow();
        });

        test('convertLinksToMarkdown handles empty, null, undefined', () => {
            expect(convertLinksToMarkdown('')).toBe('');
            expect(() => convertLinksToMarkdown(null)).toThrow();
            expect(() => convertLinksToMarkdown(undefined)).toThrow();
        });

        // limitString edge cases
        describe('limitString edge cases', () => {
            test('returns empty string if input is empty', () => {
                expect(limitString('', 5)).toBe('');
            });
            test('returns ellipsis if maxLength is 0', () => {
                expect(limitString('abc', 0)).toBe('…');
            });
            test('returns string unchanged if string is exactly maxLength', () => {
                expect(limitString('abc', 3)).toBe('abc');
            });
            test('handles empty url', () => {
                expect(limitString('abcdef', 5, '')).toBe('…');
            });
        });

        // convertMentionsToLinks edge case: multiple mentions
        test('convertMentionsToLinks handles multiple mentions', () => {
            expect(convertMentionsToLinks('Hi @foo and @bar!')).toBe('Hi [@foo](https://github.com/foo) and [@bar](https://github.com/bar)!');
        });

        // convertLinksToMarkdown edge case: multiple links
        test('convertLinksToMarkdown handles multiple links', () => {
            const input = 'https://github.com/owner/repo/pull/1 and https://github.com/owner/repo/issues/2';
            expect(convertLinksToMarkdown(input)).toBe('[PR #1](https://github.com/owner/repo/pull/1) and [Issue #2](https://github.com/owner/repo/issues/2)');
        });

        // reduceHeadings edge case: mixed headings and text
        test('reduceHeadings handles mixed headings and text', () => {
            const input = '## H2\n### H3\nNormal text';
            expect(reduceHeadings(input)).toBe('**H2**\n**__H3__**\nNormal text');
        });

        // Whitespace-only input
        test('removeCarriageReturn handles whitespace-only', () => {
            expect(removeCarriageReturn('   \r\r\r   ')).toBe('      ');
        });
        test('reduceNewlines handles whitespace-only', () => {
            expect(reduceNewlines('   \n\n   ')).toBe('   \n   ');
        });
        test('removeHTMLComments handles whitespace-only', () => {
            expect(removeHTMLComments('   ')).toBe('   ');
        });

        // Special characters and unicode
        test('convertMentionsToLinks handles unicode usernames', () => {
            expect(convertMentionsToLinks('Hi @üser!')).toBe('Hi [@üser](https://github.com/üser)!');
        });
        test('convertLinksToMarkdown handles unicode in links', () => {
            const input = 'https://github.com/owner/repo/pull/ü123';
            expect(convertLinksToMarkdown(input)).toBe('https://github.com/owner/repo/pull/ü123'); // not matched as PR
        });

        // Long string for limitString
        test('limitString truncates very long string', () => {
            const longStr = 'a'.repeat(1000);
            expect(limitString(longStr, 10)).toBe('aaaaaaaaa…');
        });

        // No-op for reduceHeadings
        test('reduceHeadings with no headings', () => {
            expect(reduceHeadings('Just some text')).toBe('Just some text');
        });

        // Multiple consecutive mentions/links
        test('convertMentionsToLinks handles consecutive mentions', () => {
            expect(convertMentionsToLinks('@foo@bar')).toBe('[@foo](https://github.com/foo)[@bar](https://github.com/bar)');
        });
        test('convertLinksToMarkdown handles consecutive links', () => {
            const input = 'https://github.com/owner/repo/pull/1https://github.com/owner/repo/issues/2';
            expect(convertLinksToMarkdown(input)).toBe('[PR #1](https://github.com/owner/repo/pull/1)[Issue #2](https://github.com/owner/repo/issues/2)');
        });

        // Mixed valid and invalid mentions
        test('convertMentionsToLinks handles mixed valid/invalid mentions', () => {
            expect(convertMentionsToLinks('Hi @foo and @-bad!')).toBe('Hi [@foo](https://github.com/foo) and @-bad!');
        });
    });
});
