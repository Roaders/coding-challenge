import { ArgumentConfig, IWriteMarkDown, ParseOptions, UsageGuideConfig } from './contracts';

export const replaceBelowDefault = `[//]: ####write-markdown_replaceBelow  `;
export const replaceAboveDefault = `[//]: ####write-markdown_replaceAbove  `;
export const configImportNameDefault = `usageGuideInfo`;

export const argumentConfig: ArgumentConfig<IWriteMarkDown> = {
    markdownPath: {
        type: String,
        alias: 'm',
        description:
            'The file to write to. Without replacement markers the whole file content will be replaced. Path can be absolute or relative.',
    },
    replaceBelow: {
        type: String,
        defaultValue: replaceBelowDefault,
        description: `A marker in the file to replace text below.`,
    },
    replaceAbove: {
        type: String,
        defaultValue: replaceAboveDefault,
        description: `A marker in the file to replace text above.`,
    },
    jsFile: {
        type: String,
        alias: 'j',
        description: `jsFile to 'require' that has an export with the 'ArgumentConfig' export. Multiple file can be specified.`,
        multiple: true,
    },
    configImportName: {
        type: String,
        alias: 'c',
        defaultValue: [configImportNameDefault],
        description: `Export name of the 'ArgumentConfig' object. Defaults to '${configImportNameDefault}'. Multiple exports can be specified.`,
        multiple: true,
    },
    verify: {
        type: Boolean,
        alias: 'v',
        description: `Verify the markdown file. Does not update the file but returns a non zero exit code if the markdown file is not correct. Useful for a pre-publish script.`,
    },
    help: { type: Boolean, alias: 'h', description: `Show this usage guide.` },
};

export const parseOptions: ParseOptions<IWriteMarkDown> = {
    helpArg: 'help',
    baseCommand: `write-markdown`,
    optionsHeaderLevel: 4,
    optionsHeaderText: `write-markdown cli options`,
    headerContentSections: [
        {
            header: 'Markdown Generation',
            headerLevel: 3,
            content: `A markdown version of the usage guide can be generated and inserted into an existing marakdown document.
Markers in the document describe where the content should be inserted, existing content betweeen the markers is overwritten.`,
        },
        {
            content: `{highlight write-markdown -m README.MD -j usageGuideConstants.js}`,
        },
    ],
    footerContentSections: [
        {
            header: 'Default Replacement Markers',
            headerLevel: 4,
            content: `replaceBelow defaults to:
{code '${replaceBelowDefault}'}
replaceAbove defaults to:
{code '${replaceAboveDefault}'}
Note the double spaces at the end to signify to markdown that there should be a new line.`,
        },
        {
            header: 'String Formatting',
            headerLevel: 4,
            content: `The only chalk modifiers supported when converting to markdown are {highlight bold} and {highlight italic}.
For example:
{code \\{bold bold text\\} \\{italic italic text\\} \\{italic.bold bold italic text\\}}
will be converted to:
{code **boldText** *italic text* ***bold italic text***}`,
        },
        {
            header: 'Additional Modifiers',
            headerLevel: 4,
            content: `Two additional style modifiers have been added that are supported when writing markdown. They are removed when printing to the console.
{code \\{highlight someText\\}}
surrounds the text in backticks:
\`someText\`
and 
{code \\{code.typescript function(message: string)\\\\\\{console.log(message);\\\\\\}\\}}
Surrounds the text in triple back ticks (with an optional language specifer, in this case typescript):
\`\`\`typescript
function(message: string)\\{console.log(message);\\}
\`\`\``,
        },
    ],
};

export const usageGuideInfo: UsageGuideConfig<IWriteMarkDown> = {
    arguments: argumentConfig,
    parseOptions,
};
