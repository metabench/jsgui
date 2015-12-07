## Test directory overview ##

For now the **test** directory consists of the following subdirectories:

- **test-utils** - test utility modules (not tests)
- **z_core** - jsgui core tests
- **z_heap** - some non-jsgui tests
- **z\_without\_jsgui** - some old non-jsgui tests (James authored)
- **z_zzz** - some old tests shelved for some reason
- **(all other)** - old tests more/less processed

The **z\_core** subdirectory is in working state, and all the tests must pass. Also **test-utils** and **z\_heap** is in working state too.

## Running tests ##

**To run some test file**, type the following command:
> mocha test-file-name

For example: run Data_Object.spec.js from current dir
> mocha Data_Object.spec.js

**To run all tests from a directory**, type the following command:
> mocha directory-name

For example: run all the test from current dir (notice the ending dot character meaning current dir)
> mocha .

**To run all tests from a directory including subdirectories**, type the following command:
> mocha --recursive directory-name

For example: run all the test from current dir and subdirs
> mocha --recursive .

## HTML tests output ##

It seems that the "good-mocha-html-reporter" project is a really good reporter for mocha:
[https://github.com/Gauge/html_table_reporter](https://github.com/Gauge/html_table_reporter)

To install the HTML reporter (globally) type the following command:
> npm install -g good-mocha-html-reporter

To run test writing to "report.html" file:
> mocha -R good-mocha-html-reporter test-file-name

To run test writing to a specified file:
> mocha -R good-mocha-html-reporter -p out-file-name test-file-name
