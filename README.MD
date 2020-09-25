# Coding Challenge

This repository is a node library that will read command line arguments from `process.argv` and return an object with all the values in. For example:

```bash
myCommand --sourceFile=myFile.txt outputFile=output.txt --format
```

might produce an object like this:

```typescript
{
    sourceFile: "myFile.txt",
    outputFile: "output.txt",
    format: true
}
```

The arguments are read by the `parse` function in the `src/parse.ts` file.

It is your job to extend the functionality of this package.

An example of how the `parse` function will be used can be found in `src/example/exampleConfigWithHelp.ts`

## Requirements

### Display Warnings

If any arguments that are required are not entered a warning message should be logged to the console. In the above example this:

```bash
myCommand --sourceFile=myFile.txt 
```

should produce an error similar to 

`You must enter a value for outputFile in the following way: '--outputFile=value'`

A warning must be logged for each missing required argument. Optional properties are marked as follows in the `CommandLineOption` object:

```typescript
{
    optionalArgument: { partial: true },
}
```

If required arguments are missing and the `exitProcess` argument is `true` then `process.exit()` must be called to prevent further execution of the programme. If `exitProcess` is `false` the partial arguments object should be returned from the `parse` function.

### Display Usage Guide

If a usage guide is setup and a command is called with the help argument, for example:

```bash
myCommand --help
```

then the usage guide should be printed to the console. If the command supports a help argument the name of the help argument is specified in the `ParseOptions` object that is optionally passed to the `parse` function.

The usage guide is rendered using the existing `showUsageGuide` function.

If the help guide is displayed then `process.exit()` should be called immediately after to avoid any further execution of the programme.


## Running The Example

```bash
npm install
npm run watch-build
node .\dist\example\exampleConfigWithHelp.js
```
