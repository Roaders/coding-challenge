import { ArgumentConfig } from './contracts';
import {
    IMocked,
    Mock,
    setupFunction,
    replacePropertiesBeforeEach,
    addMatchers,
} from '@morgan-stanley/ts-mocking-bird';
import { parse } from './parse';

describe('parse', () => {
    let mockConsole: IMocked<typeof console>;
    let mockProcess: IMocked<typeof process>;

    interface ComplexProperties {
        requiredString: string;
        defaultedString: string;
        optionalString?: string;
        requiredBoolean: boolean;
        optionalBoolean?: boolean;
        requiredArray: string[];
        optionalArray?: string[];
    }

    interface PropertiesWithHelp extends ComplexProperties {
        optionalHelpArg?: boolean;
    }

    function getConfig(): ArgumentConfig<ComplexProperties> {
        return {
            requiredString: String,
            defaultedString: { type: String, defaultValue: defaultFromOption },
            optionalString: { type: String, optional: true },
            requiredBoolean: Boolean,
            optionalBoolean: { type: Boolean, optional: true },
            requiredArray: { type: String, alias: 'o', multiple: true },
            optionalArray: { type: String, lazyMultiple: true, optional: true },
        };
    }

    function getHelpConfig(): ArgumentConfig<PropertiesWithHelp> {
        return {
            ...getConfig(),
            optionalHelpArg: { type: Boolean, optional: true, alias: 'h', description: 'This help guide' },
        };
    }

    const requiredStringValue = 'requiredStringValue';
    const requiredString = ['--requiredString', requiredStringValue];
    const defaultedStringValue = 'defaultedStringValue';
    const defaultFromOption = 'defaultFromOption';
    const defaultedString = ['--defaultedString', defaultedStringValue];
    const optionalStringValue = 'optionalStringValue';
    const optionalString = ['--optionalString', optionalStringValue];
    const requiredBoolean = ['--requiredBoolean'];
    const optionalBoolean = ['--optionalBoolean'];
    const requiredArrayValue = ['requiredArray'];
    const requiredArray = ['--requiredArray', ...requiredArrayValue];
    const optionalArrayValue = ['optionalArrayValueOne', 'optionalArrayValueTwo'];
    const optionalArray = ['--optionalArray', optionalArrayValue[0], '--optionalArray', optionalArrayValue[1]];
    const optionalHelpArg = ['--optionalHelpArg'];

    replacePropertiesBeforeEach(() => {
        addMatchers();
        mockConsole = Mock.create<typeof console>().setup(setupFunction('error'), setupFunction('log'));
        mockProcess = Mock.create<typeof process>().setup(setupFunction('exit'));

        return [{ package: process, mocks: mockProcess.mock }];
    });

    describe('should create the expected argument value object', () => {
        it('when all options are populated', () => {
            const result = parse(getConfig(), {
                logger: mockConsole.mock,
                argv: [
                    ...requiredString,
                    ...defaultedString,
                    ...optionalString,
                    ...requiredBoolean,
                    ...optionalBoolean,
                    ...requiredArray,
                    ...optionalArray,
                ],
            });

            expect(result).toEqual({
                requiredString: requiredStringValue,
                defaultedString: defaultedStringValue,
                optionalString: optionalStringValue,
                requiredArray: requiredArrayValue,
                optionalArray: optionalArrayValue,
                requiredBoolean: true,
                optionalBoolean: true,
            });
        });

        it('when optional values are ommitted', () => {
            const result = parse(getHelpConfig(), {
                logger: mockConsole.mock,
                argv: [...requiredString, ...requiredArray],
                helpArg: 'optionalHelpArg',
            });

            expect(result).toEqual({
                requiredString: requiredStringValue,
                defaultedString: defaultFromOption,
                requiredArray: requiredArrayValue,
            });

            expect(mockConsole.withFunction('log')).wasNotCalled();
            expect(mockConsole.withFunction('error')).wasNotCalled();
        });
    });
});
