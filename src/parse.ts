import { ArgumentConfig, ParseOptions, UnkownProperties, CommandLineOption } from './contracts';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { createCommandLineConfig, normaliseConfig, visit } from './helpers';
import { getOptionSections } from './helpers/options.helper';
import { removeAdditionalFormatting } from './helpers/string.helper';

export function parse<T, P extends ParseOptions<T> = ParseOptions<T>>(
    config: ArgumentConfig<T>,
    options: P = {} as P,
    exitProcess = true,
): T & UnkownProperties<P> {
    /**
     * Our list of expected command line arguments
     */
    const optionList: CommandLineOption<any>[] = createCommandLineConfig(normaliseConfig(config));
    /**
     * An object containing the values specified on the command line
     */
    const parsedArgs: T & UnkownProperties<P> = commandLineArgs(optionList, options) as any;

    return parsedArgs;
}

function showUsageGuide(options: ParseOptions<any>, optionList: CommandLineOption[]) {
    const sections = [
        ...(options.headerContentSections || []),
        ...getOptionSections(options).map((option) => ({ ...option, optionList })),
        ...(options.footerContentSections || []),
    ];

    visit(sections, (value) => {
        switch (typeof value) {
            case 'string':
                return removeAdditionalFormatting(value);
            default:
                return value;
        }
    });

    const usageGuide = commandLineUsage(sections);

    console.log(usageGuide);
}
